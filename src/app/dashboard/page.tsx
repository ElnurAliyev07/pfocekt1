import ClientPage from "./ClientPage";

const page = async () => {
  return (
    <ClientPage
      statistic={{
        total_subtask_count: 0,
        not_started_subtask_count: 0,
        in_progress_subtask_count: 0,
        finished_subtask_count: 0,
      }}
    />
  );
};

export default page;
