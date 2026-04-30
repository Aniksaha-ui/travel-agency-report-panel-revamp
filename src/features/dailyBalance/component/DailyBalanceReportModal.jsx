import Modal from "../../../components/ui/Modal";
import DailyBalanceReportViewer from "./DailyBalanceReportViewer";

export default function DailyBalanceReportModal({ isOpen, onClose, report }) {
  return (
    <Modal
      ariaLabel="Daily balance PDF preview"
      isOpen={isOpen}
      onClose={onClose}
      title={report?.reportName ?? "Daily balance PDF"}
      subtitle={report?.reportMonthLabel ?? "Saved daily balance report preview"}
    >
      <DailyBalanceReportViewer report={report} />
    </Modal>
  );
}
