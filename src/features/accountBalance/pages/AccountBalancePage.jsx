import { startTransition, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import AccountBalanceDesktopView from "../component/AccountBalanceDesktopView";
import AccountBalanceHistoryModal from "../component/AccountBalanceHistoryModal";
import AccountBalanceMobileView from "../component/AccountBalanceMobileView";
import { ACCOUNT_BALANCE_COPY } from "../constants/accountBalance.constants";
import useAccountBalance from "../hooks/useAccountBalance";
import useAccountBalanceHistory from "../hooks/useAccountBalanceHistory";

export default function AccountBalancePage() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { data, error, isLoading } = useAccountBalance();
  const {
    data: historyData,
    error: historyError,
    isLoading: isHistoryLoading,
  } = useAccountBalanceHistory(selectedAccount?.type, isHistoryOpen);
  const copy = data?.copy ?? ACCOUNT_BALANCE_COPY;
  const metrics = data?.metrics ?? [];
  const accounts = data?.accounts ?? [];
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const history = historyData?.history ?? [];
  const historySummary = historyData?.summary ?? {};
  const boardDate = formatBoardDate();

  const handleViewHistory = (account) => {
    startTransition(() => {
      setSelectedAccount(account);
      setIsHistoryOpen(true);
    });
  };

  const handleCloseHistory = () => {
    startTransition(() => {
      setIsHistoryOpen(false);
    });
  };

  return (
    <AdminLayout>
      <AccountBalanceMobileView
        accounts={accounts}
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        error={error}
        isLoading={isLoading}
        metrics={metrics}
        onViewHistory={handleViewHistory}
        summary={summary}
      />
      <AccountBalanceDesktopView
        accounts={accounts}
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        error={error}
        isLoading={isLoading}
        metrics={metrics}
        onViewHistory={handleViewHistory}
        summary={summary}
      />
      <AccountBalanceHistoryModal
        account={selectedAccount}
        error={historyError}
        history={history}
        isLoading={isHistoryLoading}
        isOpen={isHistoryOpen}
        onClose={handleCloseHistory}
        summary={historySummary}
      />
    </AdminLayout>
  );
}
