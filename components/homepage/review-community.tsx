import WorkspaceCardList from '@components/homepage/workspace-card'
import { WorkspaceCardType } from '@lib/types/home'

type Props = {
  workspaceList: WorkspaceCardType[]
}

const WorkspacesYouOwn = ({ workspaceList }: Props) => {
  return (
    <section className="pt-14 text-gray-300">
      <h2 className="text-2xl font-semibold text-decoration-line pb-8 underline decoration-4 decoration-indigo-400">
        ✍️ Communities you own
      </h2>
      <div className="grid grid-cols-2 gap-5">
        <WorkspaceCardList workspaceList={workspaceList} />
      </div>
    </section>
  )
}

export default WorkspacesYouOwn
