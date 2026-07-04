import { RadarFeed } from "@/components/RadarFeed";
import { PipelineBoard } from "@/components/PipelineBoard";
import { VerificationChecklist } from "@/components/VerificationChecklist";

export const RadarView = ({
  alerts, pipeline, tasks, sources,
  onInvestigate, onDismiss, onMove, onToggleTask,
}) => (
  <div className="tm-fade-up grid h-full grid-cols-1 gap-5 lg:grid-cols-12" style={{ minHeight: "calc(100vh - 140px)" }}>
    <div className="lg:col-span-8">
      <RadarFeed alerts={alerts} sources={sources} onInvestigate={onInvestigate} onDismiss={onDismiss} />
    </div>
    <div className="flex flex-col gap-5 lg:col-span-4">
      <VerificationChecklist tasks={tasks} onToggle={onToggleTask} />
      <PipelineBoard items={pipeline} onMove={onMove} />
    </div>
  </div>
);
