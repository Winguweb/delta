import { useRouter } from "next/router";
import { GetSampleResponse } from "../../../../../model/sample";
import { GetSamplingPointResponseWithSamples } from "../../../../../pages/admin/sampling-points/[id]";
import { SamplingPointContainer } from "../components/SamplingPointContainer";
import Link from "next/link";
import { Button } from "../../../../molecules/Buttons/Button";
import { SamplingPointDetailsTable } from "../Tables/SamplingPointDetailsTable";
import { Modal } from "../../../Modal";
import { SampleForm } from "../Forms/SampleForm";
import { PlusIcon } from "@heroicons/react/24/outline";

type SamplesTabProps = {
    isAbleToPerformActions: boolean;
    samplingPoint: GetSamplingPointResponseWithSamples;
}

export const SamplesTab = ({ isAbleToPerformActions, samplingPoint }: SamplesTabProps) => {

    const samples: GetSampleResponse[] = samplingPoint.samples;

    const router = useRouter();
    
    const isAddSampleOpen = router.query.addSample === 'true';
    const sampleToEdit = typeof router.query.sample === 'string' ? parseInt(router.query.sample) : undefined;
    const sampleToEditData = samples?.find((sample) => sample.id === sampleToEdit);


    const isEditSampleOpen = !!sampleToEdit;

    return (
        <>
            <SamplingPointContainer
                rightElement={
                    isAbleToPerformActions ?
                        <Link href={`${samplingPoint.id}?addSample=true`}>
                            <Button variant="primary-admin" iconSize="xxs" spanClassName={'hidden lg:block text-primary'} icon={<PlusIcon />} >
                                Nueva muestra
                            </Button>
                        </Link>
                        : <div></div>
                }
            >
                <SamplingPointDetailsTable devices={samplingPoint.devices} samples={samples} samplingPointId={samplingPoint.id} />
            </SamplingPointContainer>
            <Modal
                showModal={isAddSampleOpen}
                onClose={() => {
                    router.push(`/admin/sampling-points/${samplingPoint.id}`);
                }}
                closeButton
                width="max-w-[800px]"
            >
                <SampleForm
                    type="add"
                    samplingPoint={samplingPoint}
                    onCancelCb={() => {
                        router.push(`/admin/sampling-points/${samplingPoint.id}`);
                    }}
                />
            </Modal>
            {sampleToEditData && (
                <Modal
                    showModal={isEditSampleOpen}
                    onClose={() => {
                        router.push(`/admin/sampling-points/${samplingPoint.id}`);
                    }}
                    closeButton
                    width="max-w-[800px]"
                >
                    <SampleForm
                        type="edit"
                        samplingPoint={samplingPoint}
                        sampleOnSamplingPoint={sampleToEditData}
                        onCancelCb={() => {
                            router.push(`/admin/sampling-points/${samplingPoint.id}`);
                        }}
                    />
                </Modal>)
            }
        </>
    )
}
