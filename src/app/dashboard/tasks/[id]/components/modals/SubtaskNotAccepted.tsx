'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/form/Textarea";

import Reject from "../icons/Reject";
import { SubTask } from "@/types/subtask.type";
import DatePicker from "@/components/ui/form/input/NewDateTimePicker";
import { useEffect, useState, useCallback } from "react";
import { rejectSubtaskService } from "@/services/client/subtask.service";
import useSubtaskStore from "@/store/subtaskStore";

interface Props{
    subtask: SubTask,
}

interface NextSubtasKProps{
    subtask: SubTask,
    onDateChange: (id: string, key: "startDate" | "finishDate", value: string) => void;
    subtaskDates: Record<string, { startDate: string | null; finishDate: string | null }>;
    previous_subtask?: SubTask
}


const NextSubtasK: React.FC<NextSubtasKProps> = ({subtask, onDateChange, subtaskDates, previous_subtask}) => {
    
    if (!subtask) return null;
  
    return (
        <div>
            <div className="border p-4 rounded-lg shadow-xs bg-white mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {subtask.job}
                </h3>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <DatePicker
                            id={`modal_started_${subtask.id}`}
                            value={subtaskDates[subtask.id]?.startDate || ""}
                            onChange={(e) => onDateChange(String(subtask.id), "startDate", e)}
                            label="Başlama tarixi"
                            activeDatePeriods={
                                subtask.assigned_user.user.active_periods
                                    .filter((period) => subtask.task.id !== period.task)
                                    .map((period) => ({
                                        endDate: new Date(period.end),
                                        startDate: new Date(period.start)
                                    }))
                            }
                            disableDatePrevious={
                                previous_subtask &&
                                    new Date(subtaskDates[previous_subtask.id]?.finishDate || "")
                            }
                        />
                    </div>
                    <div>
                        <DatePicker
                            id={`modal_deadline_${subtask.id}`}
                            value={subtaskDates[subtask.id]?.finishDate || ""}
                            onChange={(e) => onDateChange(String(subtask.id), "finishDate", e)}
                            label="Bitmə tarixi"
                            activeDatePeriods={
                                subtask.assigned_user.user.active_periods
                                    .filter((period) => subtask.task.id !== period.task)
                                    .map((period) => ({
                                        endDate: new Date(period.end),
                                        startDate: new Date(period.start)
                                    }))
                            }
                            disableDatePrevious={ 
                                new Date((subtaskDates[subtask.id]?.startDate) || "")
                            }

                        />
                    </div>
                </div>
            </div>
            {subtask.next_subtask && (
                <NextSubtasK 
                    subtask={subtask.next_subtask} 
                    subtaskDates={subtaskDates}
                    onDateChange={onDateChange}
                    previous_subtask={subtask}  // Yeni parametre
                />
            )}
        </div>
    );
  };

  
const SubtaskNotAcceptedModal: React.FC<Props> = ({ subtask }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    

    const [reasonText, setReasonText] = useState<string>("")
    const [startDate, setStartDate] = useState<string>("");
    const [finishDate, setFinishDate] = useState<string>("");

    const [subtaskDates, setSubtaskDates] = useState<
        Record<string, { startDate: string | null; finishDate: string | null }>
    >({});
    const [errorMessages, setErrorMessages] = useState<Record<string, string | null>>({});
    
    const { fetchSubtasks } = useSubtaskStore()
    
    const initializeSubtaskDates = useCallback((currentSubtask: SubTask) => {
            setSubtaskDates((prev) => ({
                ...prev,
                [currentSubtask.id]: {
                    startDate: currentSubtask.started_date || null,
                    finishDate: currentSubtask.deadline || null,
                },
            }));
        if (currentSubtask.next_subtask) {
            initializeSubtaskDates(currentSubtask.next_subtask);
        }
    }, []);


    useEffect(() => {
        if (subtask) {
            setStartDate(subtask.started_date);
            setFinishDate(subtask.deadline);
            initializeSubtaskDates(subtask);
            console.log(subtask)
        }
    }, [initializeSubtaskDates, subtask]);

    const handleDateChange = (id: string, key: "startDate" | "finishDate", value: string) => {
        setSubtaskDates((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [key]: value,
            },
        }));
    };
    
    


    const handleClick = async () => {
        const errors: Record<string, string | null> = {};
    
        // Validate reason text
        if (!reasonText.trim()) {
            errors["reasonText"] = "Səbəb mətnini daxil edin.";
        }
    
        // Validate start and finish dates for the main subtask
        if (!startDate) {
            errors[`startDate_${subtask.id}`] = "Başlama tarixi tələb olunur.";
        }
        if (!finishDate) {
            errors[`finishDate_${subtask.id}`] = "Bitmə tarixi tələb olunur.";
        }
        if (startDate && finishDate && new Date(startDate) >= new Date(finishDate)) {
            errors[`finishDate_${subtask.id}`] = "Bitmə tarixi başlama tarixindən sonra olmalıdır.";
        }
    
        // Validate nested subtask dates
        const validateSubtaskDates = (task: SubTask) => {
            const subtaskDate = subtaskDates[task.id];
            if (!subtaskDate?.startDate) {
                errors[`startDate_${task.id}`] = "Başlama tarixi tələb olunur.";
            }
            if (!subtaskDate?.finishDate) {
                errors[`finishDate_${task.id}`] = "Bitmə tarixi tələb olunur.";
            }
            if (
                subtaskDate?.startDate &&
                subtaskDate?.finishDate &&
                new Date(subtaskDate.startDate) >= new Date(subtaskDate.finishDate)
            ) {
                errors[`finishDate_${task.id}`] = "Bitmə tarixi başlama tarixindən sonra olmalıdır.";
            }
            if (task.next_subtask) {
                validateSubtaskDates(task.next_subtask);
            }
        };
    
        if (subtask.next_subtask) {
            validateSubtaskDates(subtask.next_subtask);
        }
    
        // Set errors or proceed
        setErrorMessages(errors);
        if (Object.keys(errors).length > 0) {
            return; // Stop submission if there are errors
        }
    
        // Submit form
        console.log({
            reasonText,
            startDate,
            finishDate,
            subtaskDates,
        });
    
        // Example: Submit the data to an API
        try {
            
            // Add your API call logic here
            await rejectSubtaskService(subtask.id, {
                deadline: finishDate || "", // Provide a default value for null
                started_date: startDate || "", // Provide a default value for null
                rejected_reason: reasonText,
                next_subtask_updates: Object.values(subtaskDates).map((date) => {
                    return {
                        deadline: date.finishDate || "",  
                        started_date: date.startDate || "",  
                    };
                }),
            });
            await fetchSubtasks();
            onOpenChange();
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };
    



    return (
        <>
            <Button onPress={onOpen} className='bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-md h-[36px] px-[10px] flex items-center gap-[4px] !rounded-full shadow-sm transform transition-transform hover:scale-105'>
                <Reject />
                <span className='text-[12px] leading-[20px] text-white font-medium'>Təsdiq etmirəm</span>
            </Button>
            <Modal
                size="xl"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    <form>
                        <ModalHeader className="flex flex-col gap-1">
                            <p>Təsdiq etmirəm</p>
                            <p className="font-normal text-t-gray text-[12px]">Təsdiq səbəbi və vaxtlar</p>
                        </ModalHeader>
                        <ModalBody>
                            <div  className="max-h-[500px] overflow-y-auto">
                            <Textarea
                                label="Səbəb"
                                placeholder="Qeydinizi daxil edin"
                                value={reasonText}
                                onChange={(e) => setReasonText(e.target.value)}
                                isInvalid={!!errorMessages["reasonText"]}
                                errorMessage={errorMessages["reasonText"] || ""}
                            />
                                <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                                    <div>
                                        <DatePicker
                                            id={`modal_started_${subtask.id}`}
                                            value={startDate || ""}
                                            onChange={(e) => {
                                                setStartDate(e);
                                                handleDateChange(String(subtask.id), "startDate", e);
                                            }
                                            }
                                            label="Başlama tarixi"
                                            activeDatePeriods={
                                                subtask.assigned_user.user.active_periods
                                                    .filter((period) => subtask.task.id !== period.task)
                                                    .map((period) => ({
                                                        endDate: new Date(period.end),
                                                        startDate: new Date(period.start)
                                                    }))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <DatePicker
                                            id={`modal_deadline_${subtask.id}`}
                                            value={finishDate || ""}
                                            onChange={(e) => {
                                                setFinishDate(e)
                                                handleDateChange(String(subtask.id), "finishDate", e);
                                            }}
                                            label="Bitmə tarixi"
                                            disableDatePrevious={new Date(startDate || "")}
                                            activeDatePeriods={
                                                subtask.assigned_user.user.active_periods
                                                    .filter((period) => subtask.task.id !== period.task)
                                                    .map((period) => ({
                                                        endDate: new Date(period.end),
                                                        startDate: new Date(period.start)
                                                    }))
                                            }
                                        />
                                    </div>
                                    
                                </div>
                                {
                                    subtask.next_subtask && 
                                    <div className="border-t-1 mt-[20px] pt-[20px] border-custom-gray">
                                        <p className="text-t-black font-medium mb-[12px]">Növbəti tapşırıqlar</p>  
                                        <NextSubtasK 
                                            subtask={subtask.next_subtask}
                                            onDateChange={handleDateChange}
                                            subtaskDates={subtaskDates}
                                            previous_subtask={subtask}
                                        />
                                    </div>
                                }
                                
                            </div>
                        </ModalBody>
                        <ModalFooter className="flex gap-2 justify-end">
                            <Button variant="flat" className="font-medium text-t-black rounded-[8px]" onPress={onOpenChange}>    
                                Bağla
                            </Button>
                            <Button variant="primary" className="bg-primary hover:bg-primary-hover font-medium rounded-[8px] text-white" onClick={handleClick}>
                                Göndər
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
}

export default SubtaskNotAcceptedModal;
