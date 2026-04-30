import { startTransition, useState } from "react";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import GuideEfficiencyDesktopView from "../component/GuideEfficiencyDesktopView";
import GuideEfficiencyMobileView from "../component/GuideEfficiencyMobileView";
import GuideEfficiencyTableFooter from "../component/GuideEfficiencyTableFooter";
import { GUIDE_EFFICIENCY_COPY } from "../constants/guideEfficiency.constants";
import useGuideEfficiency from "../hooks/useGuideEfficiency";

export default function GuideEfficiencyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isLoading } = useGuideEfficiency(debouncedSearchTerm);
  const copy = data?.copy ?? GUIDE_EFFICIENCY_COPY;
  const metrics = data?.metrics ?? [];
  const guides = data?.guides ?? [];
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const topGuide = summary.topPackageGuide;
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const handleSearchChange = (event) => {
    const { value } = event.target;

    startTransition(() => {
      setSearchTerm(value);
    });
  };

  const tableFooter = (
    <GuideEfficiencyTableFooter
      debouncedSearchTerm={debouncedSearchTerm}
      guides={guides}
      summary={summary}
    />
  );

  return (
    <AdminLayout>
      <GuideEfficiencyMobileView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        guides={guides}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        searchTerm={searchTerm}
        summary={summary}
        topGuide={topGuide}
      />
      <GuideEfficiencyDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        guides={guides}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
        topGuide={topGuide}
      />
    </AdminLayout>
  );
}
