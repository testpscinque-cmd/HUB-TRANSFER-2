import { RadarFeed } from "@/components/RadarFeed";
import { PipelineBoard } from "@/components/PipelineBoard";
import { VerificationChecklist } from "@/components/VerificationChecklist";

export const RadarView = ({
  alerts, pipeline, tasks, scanning,
  onScan, onInvestigate, onDismiss, onMove, onToggleTask,
}) => (
  <div className="tm-fade-up grid h-full grid-cols-1 gap-5 lg:grid-cols-12" style={{ minHeight: "calc(100vh - 140px)" }}>
    <div className="lg:col-span-4">
      <RadarFeed alerts={alerts} scanning={scanning} onScan={onScan} onInvestigate={onInvestigate} onDismiss={onDismiss} />
    </div>
    <div className="lg:col-span-5">
      <PipelineBoard items={pipeline} onMove={onMove} />
    </div>
    <div className="lg:col-span-3">
      <VerificationChecklist tasks={tasks} onToggle={onToggleTask} />
    </div>
  </div>
);
