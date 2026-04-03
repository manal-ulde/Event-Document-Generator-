import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, FileText, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { api, downloadBase64Pdf } from "@/lib/api";
import { CLUBS, COLLEGE_BRAND, getClubById } from "@/lib/clubs";

interface ProposalData {
  collegeName: string;
  collegeAddress: string;
  collegeAcronym: string;
  clubId: string;
  authorityName: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  subject: string;
  targetAudience: string;
  budget: string;
  objective: string;
  eventSummary: string;
  keyPoints: string;
}

const initialState: ProposalData = {
  collegeName: COLLEGE_BRAND.name,
  collegeAddress: COLLEGE_BRAND.address,
  collegeAcronym: COLLEGE_BRAND.acronym,
  clubId: CLUBS[0].id,
  authorityName: "The Principal",
  eventTitle: "",
  eventDate: "",
  venue: "",
  subject: "",
  targetAudience: "",
  budget: "",
  objective: "",
  eventSummary: "",
  keyPoints: "",
};

const LogoBadge = ({ label, hex }: { label: string; hex: string }) => (
  <div
    className="flex h-14 w-14 items-center justify-center text-xs font-bold uppercase tracking-wider text-white brutal-border"
    style={{ backgroundColor: hex }}
  >
    {label}
  </div>
);

const ProposalGenerator = () => {
  const [data, setData] = useState<ProposalData>(initialState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<{ fileName: string; pdfBase64: string } | null>(null);
  const [status, setStatus] = useState("");

  const selectedClub = useMemo(() => getClubById(data.clubId), [data.clubId]);

  const update = (field: keyof ProposalData, value: string) => {
    setData((previous) => ({ ...previous, [field]: value }));
  };

  const generateProposal = async () => {
    setIsGenerating(true);
    setStatus("");

    try {
      const response = await api.generateProposal({
        ...data,
        clubName: selectedClub.name,
        clubAcronym: selectedClub.acronym,
        clubBrandColor: selectedClub.hex,
        collegeBrandColor: COLLEGE_BRAND.hex,
        keyPoints: data.keyPoints
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setGeneratedFile(response);
      setStatus("Proposal PDF generated successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to generate proposal.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedFile) {
      return;
    }

    downloadBase64Pdf(generatedFile.pdfBase64, generatedFile.fileName);
  };

  const keyPoints = data.keyPoints
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <motion.header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="brutal-btn-outline flex items-center gap-1 px-3 py-2 text-xs">
            <ArrowLeft className="h-4 w-4" strokeWidth={3} />
            Back
          </Link>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">Proposal Generator</h1>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">End-to-end branded proposal flow</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={generateProposal} className="brutal-btn-primary flex items-center gap-2 py-2" disabled={isGenerating}>
            {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.5} /> : <FileText className="h-4 w-4" strokeWidth={3} />}
            Generate PDF
          </button>
          <button onClick={handleDownload} className="brutal-btn-secondary flex items-center gap-2 py-2" disabled={!generatedFile}>
            <Download className="h-4 w-4" strokeWidth={3} />
            Download
          </button>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.div className="space-y-4" initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">College Name</label>
              <input className="brutal-input" value={data.collegeName} onChange={(event) => update("collegeName", event.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">College Acronym</label>
              <input className="brutal-input" value={data.collegeAcronym} onChange={(event) => update("collegeAcronym", event.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">College Address</label>
            <input className="brutal-input" value={data.collegeAddress} onChange={(event) => update("collegeAddress", event.target.value)} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Club</label>
            <select className="brutal-input" value={data.clubId} onChange={(event) => update("clubId", event.target.value)}>
              {CLUBS.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.acronym} - {club.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Addressed To</label>
              <input className="brutal-input" value={data.authorityName} onChange={(event) => update("authorityName", event.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Event Date</label>
              <input className="brutal-input" type="date" value={data.eventDate} onChange={(event) => update("eventDate", event.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Event Title</label>
              <input className="brutal-input" placeholder="AI Innovation Summit" value={data.eventTitle} onChange={(event) => update("eventTitle", event.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Venue</label>
              <input className="brutal-input" placeholder="Seminar Hall A" value={data.venue} onChange={(event) => update("venue", event.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Subject</label>
              <input className="brutal-input" placeholder="Proposal for AI Innovation Summit" value={data.subject} onChange={(event) => update("subject", event.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Estimated Budget</label>
              <input className="brutal-input" placeholder="35000" value={data.budget} onChange={(event) => update("budget", event.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Target Audience</label>
            <input className="brutal-input" placeholder="Second year and third year students" value={data.targetAudience} onChange={(event) => update("targetAudience", event.target.value)} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Objective</label>
            <textarea className="brutal-input min-h-[96px] resize-y" value={data.objective} onChange={(event) => update("objective", event.target.value)} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Event Summary</label>
            <textarea className="brutal-input min-h-[120px] resize-y" value={data.eventSummary} onChange={(event) => update("eventSummary", event.target.value)} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider">Key Points</label>
            <textarea className="brutal-input min-h-[100px] resize-y" placeholder={"One point per line\nExpected outcomes\nRequired approvals"} value={data.keyPoints} onChange={(event) => update("keyPoints", event.target.value)} />
          </div>

          {status ? <p className="font-mono text-xs text-muted-foreground">{status}</p> : null}
        </motion.div>

        <motion.div className="sticky top-6" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="brutal-card min-h-[760px]">
            <div className="flex items-start justify-between gap-4 border-b-2 border-foreground pb-5">
              <LogoBadge label={data.collegeAcronym || "PCCOE"} hex={COLLEGE_BRAND.hex} />
              <div className="flex-1 text-center">
                <h2 className="text-lg font-bold uppercase">{data.collegeName || COLLEGE_BRAND.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{data.collegeAddress || COLLEGE_BRAND.address}</p>
              </div>
              <LogoBadge label={selectedClub.acronym} hex={selectedClub.hex} />
            </div>

            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Date", data.eventDate || "Event date"],
                  ["Club", selectedClub.acronym],
                  ["To", data.authorityName || "Respective authority"],
                  ["Venue", data.venue || "Venue"],
                ].map(([label, value]) => (
                  <div key={label} className="brutal-border bg-muted/20 p-3">
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-bold">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Subject</p>
                <p className="mt-2 text-sm font-medium">{data.subject || `Proposal for ${data.eventTitle || "the planned event"}`}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Body Preview</p>
                <div className="mt-3 space-y-4 text-sm leading-7 text-muted-foreground">
                  <p>
                    This proposal is submitted on behalf of {selectedClub.name} for the event{" "}
                    <span className="font-bold text-foreground">{data.eventTitle || "Event Title"}</span>.
                  </p>
                  <p>
                    The event is proposed for {data.eventDate || "the selected date"} at {data.venue || "the proposed venue"} for {data.targetAudience || "the target audience"}.
                  </p>
                  <p>
                    The core objective is to {data.objective || "describe the objective clearly"}.
                  </p>
                  <p className="whitespace-pre-wrap">
                    {data.eventSummary || "Add the event summary here so the formal proposal body can be generated properly."}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Key Points</p>
                <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {keyPoints.length > 0 ? keyPoints.map((point) => <p key={point}>- {point}</p>) : <p>Add the main approvals, logistics, or outcomes one per line.</p>}
                </div>
              </div>

              <div className="rounded-[18px] bg-background p-4 brutal-border">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Branding note</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Official image files were not present in the project, so the proposal currently uses branded acronym logo badges for PCCOE and the selected club. If you add official PNG/JPG logo assets later, this flow can swap to them directly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProposalGenerator;
