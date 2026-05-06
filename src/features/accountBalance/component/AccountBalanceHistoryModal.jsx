import Badge from "../../../components/common/Badge";
import Modal from "../../../components/ui/Modal";
import Table from "../../../components/ui/Table";
import { ACCOUNT_BALANCE_COPY } from "../constants/accountBalance.constants";
import { accountBalanceHistoryColumns } from "./accountBalanceView.config";

export default function AccountBalanceHistoryModal({
  account,
  error,
  history,
  isLoading,
  isOpen,
  onClose,
  summary,
}) {
  return (
    <Modal
      ariaLabel="Account balance history"
      isOpen={isOpen}
      onClose={onClose}
      title={ACCOUNT_BALANCE_COPY.historyTitle}
      subtitle={ACCOUNT_BALANCE_COPY.historySubtitle}
      dialogClassName="account-balance-modal"
      bodyClassName="account-balance-modal__body"
    >
      <div className="account-balance-modal__header">
        <div>
          <div className="account-balance-modal__eyebrow">Selected balance type</div>
          <div className="account-balance-modal__title">{account?.typeLabel ?? "Unknown type"}</div>
          <div className="account-balance-modal__meta">
            {account?.accountName ?? "No account selected"} • {account?.accountNumber ?? "No number"}
          </div>
        </div>
        {account?.typeLabel ? <Badge color={account.typeTone}>{account.typeLabel}</Badge> : null}
      </div>

      <div className="account-balance-modal__summary">
        <div className="account-balance-modal__summary-item">
          <span>Entries</span>
          <strong>{summary?.totalRowsLabel ?? "0"}</strong>
        </div>
        <div className="account-balance-modal__summary-item">
          <span>Total amount</span>
          <strong>{summary?.totalAmountLabel ?? "BDT 0"}</strong>
        </div>
        <div className="account-balance-modal__summary-item">
          <span>Latest transaction</span>
          <strong>{summary?.latestTransactionLabel ?? "Not available"}</strong>
        </div>
      </div>

      {error ? (
        <div className="text-danger">{error.message || "Unable to load account history."}</div>
      ) : null}

      {isLoading ? (
        <div className="account-balance-modal__empty">Loading account history...</div>
      ) : history.length ? (
        <Table
          columns={accountBalanceHistoryColumns}
          data={history}
          emptyTitle="No account history rows"
          emptyDescription="No transactions were returned for the selected balance type."
        />
      ) : (
        <div className="account-balance-modal__empty">
          No transactions were returned for the selected balance type.
        </div>
      )}
    </Modal>
  );
}
