import { GetSamplingPointResponseWithSamples } from "../../../../../pages/admin/sampling-points/[id]";
import { SamplingPointDetailsTable } from "../Tables/SamplingPointDetailsTable";

type DevicesTabProps = {
    isAbleToPerformActions: boolean;
    samplingPoint: GetSamplingPointResponseWithSamples;
}

export const DevicesTab = ({ isAbleToPerformActions, samplingPoint }: DevicesTabProps) => {
    return (
        <>
            <SamplingPointDetailsTable devices={samplingPoint.devices} />
        </>
    )
}
