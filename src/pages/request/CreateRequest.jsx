import CardMetrics from "./layout/CardMetrics"
import RequestTable from "./layout/RequestTable"
const CreateRequest = () => {
    return (
        <div className="grid gap-4">
            <CardMetrics />
            <RequestTable/>
        </div>
    )
}

export default CreateRequest