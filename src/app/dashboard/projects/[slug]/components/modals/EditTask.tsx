// "use client";

// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Plus from "../../../../components/ui/icons/Plus";
// import FileUpload from "@/components/ui/form/input/FileUpload";
// import { updateTaskService } from "@/services/client/task.service";
// import { UpdateTask } from "@/types/task.type"; // Added import for UpdateTask
// import { ApiError } from "@/types/error.type";
// import useTaskStore from "@/store/taskStore";
// import { convertFileToBase64 } from "@/utils/base64";
// import useTaskUserStore, { TaskUserErrorMessages } from "@/store/taskUserStore";
// import SelectUserTaskModal from "./SelectUserTask";
// import useProjectMemberStore from "@/store/projectMemberStore";
// import CheckerSelect from "../inputs/CheckerSelect";
// import Close from "../icons/Close";
// import { formatDate } from "@/utils/formateDateTime";
// import PlanningPostListModal from "./PlanningPostList";
// import { PlanningPost } from "@/types/planning.type";
// import { useEffect, useState } from "react";
// import DatePicker from "@/components/ui/form/input/NewDateTimePicker";
// import usePlanningStore from "@/store/planningStore";
// import SubtaskSelect from "../inputs/SubtaskSelect";
// import Trash from "@/app/dashboard/workspaces/[slug]/components/icons/Trash";
// import useGeneralStore from "@/store/generalStore";
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "@/components/ui/modal";
// import Button from "@/components/ui/Button";
// import { Input, Textarea } from "@/components/ui/form";
// import { FaCheckCircle, FaRegCircle, FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";
// import AssignerSelect from "../inputs/AssingnerSelect";
// import { removeURLParam } from "@/utils/urlUtils";

// // Define Zod schema
// const schema = z
//   .object({
//     teamWorkIsActive: z.boolean(),
//     title: z.string().min(1, "Başlıq tələb olunur"),
//     content: z.string().optional(),
//     files: z.array(z.any()).optional(),
//     planning_post: z.number().optional(),
//     started: z.string().optional(),
//     deadline: z.string().optional(),
//     assigner: z.number().optional(), // Corresponds to selectedAssigner.user.id
//     subtasks_count: z.number(),
//     // Added missing fields for UpdateTask
//     priority: z.enum(["highest", "normal", "lowest"]).default("normal"),
//     completed: z.boolean().default(false),
//     client_accepted: z.boolean().default(false),
//   })
//   .superRefine((data, ctx) => {
//     if (!data.teamWorkIsActive) {
//       if (!data.started) {
//         ctx.addIssue({
//           path: ["started"],
//           code: z.ZodIssueCode.custom,
//           message: "Başlama tarixi tələb olunur",
//         });
//       }

//       if (!data.deadline) {
//         ctx.addIssue({
//           path: ["deadline"],
//           code: z.ZodIssueCode.custom,
//           message: "Bitmə tarixi tələb olunur",
//         });
//       }
//     }
//     if (data.subtasks_count < 1 && data.teamWorkIsActive) {
//       ctx.addIssue({
//         path: ["subtasks_count"],
//         code: z.ZodIssueCode.custom,
//         message: "Alt işlər sayı tələb olunur",
//       });
//     }
//   });

// type FormData = z.infer<typeof schema>;

// interface Props {
//   isOpenProps?: boolean;
//   children?: React.ReactNode;
//   containerClassName?: string;
//   taskId?: number;
// }

// const EditTaskModal: React.FC<Props> = ({ 
//   isOpenProps = false, 
//   children, 
//   containerClassName,
//   taskId 
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const onOpenChange = () => {
//     setIsOpen(!isOpen);
//     removeURLParam("isOpen");
//   };
//   const onOpen = () => setIsOpen(true);
//   const onClose = () => {
//     setIsOpen(false);
//   };

//   const [sosialIsActive, setSosialIsActive] = useState(false);
//   const [teamWorkIsActive, setTeamWorkIsActive] = useState(false);
//   const [selectedPlatform, setSelectedPlatform] = useState<string>("");
//   const [priority, setPriority] = useState<string>("normal");
//   const [contentTypes, setContentTypes] = useState<{ [key: string]: boolean }>({});
//   const [expectedOutput, setExpectedOutput] = useState<string>("");
//   const [isInstructionOpen, setIsInstructionOpen] = useState<boolean>(false);

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     setError,
//     reset,
//     setValue,
//     watch,
//     trigger,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: { // Basic initial defaults
//       title: "",
//       content: "",
//       started: "",
//       deadline: "",
//       planning_post: undefined,
//       assigner: undefined,
//       subtasks_count: 0,
//       teamWorkIsActive: false,
//       priority: "normal", 
//       completed: false,
//       client_accepted: false,
//     },
//   });

//   useEffect(() => {
//     if (isOpenProps) {
//       onOpen();
//     } else {
//       onClose();
//     }
//   }, [isOpenProps]);

//   const { fetchTasks, project, tasks } = useTaskStore();
//   const {
//     started,
//     setStarted,
//     deadline,
//     setDeadline,
//     selectedUsers,
//     errorMessages,
//     selectedUser,
//     reset: resetSelectedUsers,
//     setSelectedUser,
//     setSelectedTaskChecker,
//     setSelectedAssigner,
//     selectedTaskChecker,
//     selectedAssigner,
//     removeUser,
//     updateUserContent,
//     updateUserDeadline,
//     updateUserFile,
//     updateUserJob,
//     updateUserStarted,
//     addUser,
//     updateUserTaskChecker,
//     updateUserNextSubtaskTemp,
//     addUserFile,
//     removeUserFile,
//   } = useTaskUserStore();
//   const { planning } = usePlanningStore();
//   const { projectMembers, fetchProjectMembers } = useProjectMemberStore();
//   const { setIsLoading } = useGeneralStore();

//   const [taskFiles, setTaskFiles] = useState<(File | null)[]>([new File([], "")]);

//   // Effect for loading task data when modal opens and task/projectMembers are available
//   useEffect(() => {
//     if (isOpen && taskId && tasks && projectMembers) {
//       const task = tasks.find(t => t.id === taskId);
//       if (task) {
//         reset({
//           title: task.title || "",
//           content: task.content || "", // Raw content; specific text is added in onSubmit
//           started: task.started ? formatDate(task.started) : "",
//           deadline: task.deadline ? formatDate(task.deadline) : "",
//           planning_post: task.planning_post?.id,
//           assigner: task.task_assigner?.user?.id,
//           subtasks_count: task.subtasks?.length || 0,
//           teamWorkIsActive: !!(task.subtasks && task.subtasks.length > 0),
//           priority: task.priority || "normal",
//           completed: task.completed ?? false,
//           client_accepted: task.client_accepted ?? false,
//         });

//         setPriority(task.priority || "normal");
//         // Prefer direct boolean 'is_social_media_task' if available on 'task' object
//         setSosialIsActive(task.is_social_media_task || false); 
//         setTeamWorkIsActive(!!(task.subtasks && task.subtasks.length > 0));

//         const assignerMember = projectMembers.find(m => m.user.id === task.task_assigner?.user?.id);
//         setSelectedAssigner(assignerMember || null);
//         const checkerMember = projectMembers.find(m => m.user.id === task.task_checker?.user?.id);
//         setSelectedTaskChecker(checkerMember || null);

//         let derivedPlatform = "";
//         if (task.is_social_media_task) {
//           const platformMatch = task.content?.match(/Sosial Media Task - ([^\n]+)/);
//           if (platformMatch && platformMatch[1]) {
//             // Attempt to extract platform more cleanly
//             derivedPlatform = platformMatch[1].split(/Kontent Növləri:|Bu görəv sosial media/)[0].trim();
//             setSelectedPlatform(derivedPlatform);
//           } else {
//             setSelectedPlatform(""); // Task is social media, but platform not found in content string
//           }
//         } else {
//           setSelectedPlatform("");
//         }
        
//         const newContentTypes: Record<string, boolean> = {};
//         if (derivedPlatform) {
//           const contentTypesMatch = task.content?.match(/Kontent Növləri:\n([\s\S]*?)(?=\n\nBu görəv sosial media|\n\n|$)/);
//           if (contentTypesMatch && contentTypesMatch[1]) {
//             const types = contentTypesMatch[1].split('\n').map(line => line.trim().replace(/^- /, '')).filter(type => type.length > 0);
//             types.forEach(type => {
//               newContentTypes[`${derivedPlatform} - ${type}`] = true;
//             });
//           }
//         }
//         setContentTypes(newContentTypes);

//         if (task.task_files?.length) {
//           setTaskFiles(task.task_files.map(tf => {
//             const fileName = tf.file?.split('/').pop() || tf.title || `file_${Date.now()}`;
//             try {
//               return new File([], fileName);
//             } catch (e) {
//               return new File([], `file_${Date.now()}`);
//             }
//           }));
//         } else {
//           setTaskFiles([new File([], "")]);
//         }

//         resetSelectedUsers();
//         if (task.subtasks?.length) {
//           task.subtasks.forEach((subtask, index) => {
//             const projectMember = projectMembers.find(m => m.user.id === subtask.assigned_to);
//             const subtaskCheckerMember = projectMembers.find(m => m.user.id === subtask.subtask_checker?.user?.id);
//             if (projectMember) {
//               addUser({
//                 order: index + 1, // Or manage order based on existing logic
//                 projectMember,
//                 isPlanningPost: false,
//                 content: subtask.content,
//                 deadline: subtask.deadline ? formatDate(subtask.deadline) : "",
//                 started: subtask.started_date ? formatDate(subtask.started_date) : "",
//                 job: subtask.job,
//                 taskChecker: subtaskCheckerMember,
//                 nextSubtaskTemp: subtask.next_subtask_temp_id || null, 
//               });
//             }
//           });
//         }
//       } else if (!task && isOpen && taskId) {
//         console.warn(`EditTaskModal: Task with ID ${taskId} not found. Resetting form.`);
//         reset({
//           title: "", content: "", started: "", deadline: "", planning_post: undefined,
//           assigner: undefined, subtasks_count: 0, teamWorkIsActive: false,
//           priority: undefined, completed: undefined, client_accepted: undefined,
//         });
//         setPriority("normal"); setSosialIsActive(false); setTeamWorkIsActive(false);
//         setSelectedAssigner(null); setSelectedTaskChecker(null); setSelectedPlatform("");
//         setContentTypes({}); setTaskFiles([new File([], "")]); resetSelectedUsers();
//       }
//     }
//   }, [
//     isOpen, taskId, tasks, projectMembers, reset, 
//     addUser, resetSelectedUsers, 
//     setSelectedAssigner, setSelectedTaskChecker, 
//     setPriority, setSosialIsActive, setTeamWorkIsActive, 
//     setSelectedPlatform, setContentTypes, setTaskFiles
//   ]);

//   // Effect for resetting form and states when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       reset({
//         title: "", content: "", started: "", deadline: "",
//         planning_post: undefined, assigner: undefined, subtasks_count: 0,
//         teamWorkIsActive: false, priority: undefined, completed: undefined,
//         client_accepted: undefined,
//       });
//       setTaskFiles([new File([], "")]);
//       resetSelectedUsers();
//       setSosialIsActive(false);
//       setTeamWorkIsActive(false);
//       setSelectedPlatform("");
//       setPriority("normal");
//       setContentTypes({});
//       setSelectedAssigner(null);
//       setSelectedTaskChecker(null);
//       setExpectedOutput(""); 
//       setIsInstructionOpen(false); 
//     }
//   }, [
//     isOpen, reset, resetSelectedUsers, setTaskFiles, 
//     setSosialIsActive, setTeamWorkIsActive, setSelectedPlatform, 
//     setPriority, setContentTypes, setSelectedAssigner, setSelectedTaskChecker,
//     setExpectedOutput, setIsInstructionOpen
//   ]);


//   const handleAddFile = () => {
//     setTaskFiles([...taskFiles, null]);
//   };

//   const handleFileChange = (file: File | null, index: number) => {
//     if (file) {
//       const updatedFiles = [...taskFiles];
//       updatedFiles[index] = file;
//       setTaskFiles(updatedFiles);
//     }
//   };

//   const handleRemoveFile = (index: number) => {
//     const updatedFiles = [...taskFiles];
//     updatedFiles.splice(index, 1);
//     setTaskFiles(updatedFiles);
//   };

//   const validateForm = (): boolean => {
//     const { selectedUsers } = useTaskUserStore.getState();
//     let isValid = true;

//     const updatedErrors: Record<number, TaskUserErrorMessages> = {};

//     selectedUsers.forEach((user) => {
//       const userErrors: TaskUserErrorMessages = {};

//       if (!user.job || user.job.trim() === "") {
//         userErrors.job = ["Task başlığı doldurulmalıdır."];
//         isValid = false;
//       }

//       if (!user.started) {
//         userErrors.started = ["Başlama tarixi seçilməlidir."];
//         isValid = false;
//       }

//       if (!user.deadline) {
//         userErrors.deadline = ["Bitmə tarixi seçilməlidir."];
//         isValid = false;
//       }

//       if (
//         user.started &&
//         user.deadline &&
//         new Date(user.deadline) < new Date(user.started)
//       ) {
//         userErrors.deadline = [
//           ...(userErrors.deadline || []),
//           "Bitmə tarixi başlama tarixindən əvvəl ola bilməz.",
//         ];
//         isValid = false;
//       }

//       updatedErrors[user.order] = userErrors;
//     });

//     useTaskUserStore.setState((state) => ({
//       errorMessages: {
//         ...state.errorMessages,
//         ...updatedErrors,
//       },
//     }));

//     return isValid;
//   };

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     control,
//     reset,
//     setError,
//     trigger,
//     setValue,
//     clearErrors,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       teamWorkIsActive: false,
//       subtasks_count: 0,
//       priority: "normal",
//       completed: false,
//       client_accepted: false,
//     },
//   });

//   useEffect(() => {
//     setValue("subtasks_count", selectedUsers.length);
//     if (selectedUser) {
//       const updateSelectedUser = selectedUsers.find(
//         (user) => user.order === selectedUser.order
//       );
//       if (updateSelectedUser) {
//         setSelectedUser(updateSelectedUser);
//       }
//     } else if (selectedUsers.length > 0) {
//       setSelectedUser(selectedUsers[0]);
//     }
//   }, [selectedUser, selectedUsers, setSelectedUser, setValue]);

//   const onSubmit = async (data: FormData) => {
//     try {
//       setIsLoading(true);
//       const isValid = validateForm();
//       if (!isValid) {
//         console.log("Zorunlu alanlar doldurulmalıdır.");
//         setIsLoading(false);
//         return;
//       }
//       if (!project || !taskId) {
//         setIsLoading(false);
//         return;
//       }

//       const files = await Promise.all(
//         taskFiles.map(async (file) => {
//           if (file?.name) {
//             const base64File = await convertFileToBase64(file);
//             return base64File;
//           }
//           return null;
//         })
//       );

//       const filteredFiles = files.filter((file) => file !== null) as string[];

//       const subtasksData = await Promise.all(
//         selectedUsers.map(async (task) => {
//           const subtaskFiles = task.files
//             ? await Promise.all(
//                 task.files.map(async (file) =>
//                   file?.name ? await convertFileToBase64(file) : null
//                 )
//               )
//             : [];

//           const filteredSubtaskFiles = subtaskFiles.filter(
//             (file) => file !== null
//           ) as string[];

//           return {
//             assigned_to: task.projectMember.user.id,
//             subtask_files: filteredSubtaskFiles,
//             content: task.content || "",
//             deadline: task.deadline || "",
//             started_date: task.started || "",
//             job: task.job || "",
//             next_subtask_temp_id: task.nextSubtaskTemp || null,
//             subtask_checker: task.taskChecker?.user.id,
//           };
//         })
//       );

//       const contentTypesTextValue =
//         Object.keys(contentTypes).length > 0
//           ? "\n\nKontent Növləri:\n" +
//             Object.keys(contentTypes)
//               .map((key) => `- ${key.split("-")[1]}`)
//               .join("\n")
//         : "";

//       const socialMediaTextValue =
//         sosialIsActive && selectedPlatform
//           ? `\n\nSosial Media Task - ${selectedPlatform}${contentTypesTextValue}\n\nBu görəv sosial media kontent hazırlamaq üçündür. Alt görəvləri yaradaraq müxtəlif üzvlər arasında bölüşdürə bilərsiniz.`
//           : "";

//       const teamWorkTextValue = teamWorkIsActive
//         ? "\n\nKomanda İşi\n\nBu görəv komanda üzvləri arasında paylaşılmalıdır. Alt görəvləri yaradaraq görəvləri bölüşdürə bilərsiniz."
//         : "";

//       const requestData: UpdateTask = {
//         title: data.title,
//         content: (data.content || "") + socialMediaTextValue + teamWorkTextValue,
//         deadline: data.deadline || "",
//         started: data.started || "",
//         project: project.id,
//         task_checker: selectedTaskChecker?.user.id ?? 0,
//         task_assigner: selectedAssigner?.user.id ?? 0,
//         planning_post: data.planning_post ?? 0,
//         task_files: filteredFiles,
//         subtasks: subtasksData,
//         priority: data.priority,
//         completed: data.completed,
//         client_accepted: data.client_accepted,
//         is_social_media_task: sosialIsActive,
//       };

//       await updateTaskService(taskId, requestData);
//       await fetchTasks(true);
//       await fetchProjectMembers(true);
      
//       onOpenChange(); // Close modal
      
//       // Reset form and local states after successful submission
//       // Pass an empty object or specific undefined values to allow Zod defaults to apply
//       reset({
//         title: "",
//         content: "",
//         started: "",
//         deadline: "",
//         planning_post: undefined,
//         assigner: undefined,
//         subtasks_count: 0,
//         teamWorkIsActive: false,
//         // For fields with Zod defaults, omitting them or setting to undefined 
//         // allows the resolver to apply the defaults.
//         priority: undefined, 
//         completed: undefined,
//         client_accepted: undefined,
//       });
//       setTaskFiles([]);
//       resetSelectedUsers();
//       setSosialIsActive(false);
//       setTeamWorkIsActive(false);
//       setSelectedPlatform("");
//       setPriority("normal");
//       setContentTypes({});
//       setSelectedAssigner(null);
//       setSelectedTaskChecker(null);

//     } catch (error) {
//       const apiErrors = (error as ApiError).data;
//       if (apiErrors && typeof apiErrors === "object") {
//         Object.keys(apiErrors).forEach((field) => {
//           const errorMessage = apiErrors[field]?.[0];
//           if (field === "non_field_errors" || field === "detail") {
//             setError("root.serverError" as any, {
//               type: "custom",
//               message: errorMessage,
//             });
//           } else {
//             setError(field as keyof FormData, {
//               type: "server",
//               message: errorMessage,
//             });
//           }
//         });
//       } else {
//         setError("root.serverError" as any, {
//           type: "custom",
//           message: "Gözlənilməyən xəta baş verdi",
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const getContentTypesForPlatform = (platform: string): string[] => {
//     const contentTypesByPlatform: { [key: string]: string[] } = {
//       "İnstaqram": ["Post", "Stories", "Reels", "Karusel"],
//       "Facebook": ["Post", "Stories", "Video", "Tədbir"],
//       "TikTok": ["Video", "Duet", "Stitch", "Canlı"],
//       "YouTube": ["Video", "Short", "Canlı", "Topluluq"],
//     };
//     return contentTypesByPlatform[platform] || [];
//   };

//   const handleContentTypeChange = (platform: string, type: string) => {
//     const key = `${platform} - ${type}`;
//     setContentTypes(prev => {
//       const newContentTypes = { ...prev };
//       if (newContentTypes[key]) {
//         delete newContentTypes[key];
//       } else {
//         newContentTypes[key] = true;
//       }
//       return newContentTypes;
//     });
//   };

//   return (
//     <>
//       {children ? (
//         <button className={containerClassName} onClick={onOpenChange}>
//           {children}
//         </button>
//       ) : (
//         <Button
//           onClick={onOpenChange}
//           className="bg-primary rounded-[8px] text-white text-[14px] font-[500] w-full md:w-auto"
//         >
//           <Plus />
//           <span>Taskı redaktə et</span>
//         </Button>
//       )}
//       <Modal
//         isOpen={isOpen}
//         size="xl"
//         onOpenChange={onOpenChange}
//         placement="center"
//       >
//         <ModalContent>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <ModalHeader className="pl-[16px] pr-[16px] md:pl-[25px] md:pr-[25px]">
//               <div className="flex flex-1 w-full pr-3 items-center justify-between">
//                 <span>Taskı redaktə et</span>
//                 <button
//                   type="button"
//                   onClick={() => setIsInstructionOpen(true)}
//                   className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
//                 >
//                   Təlimatlar
//                 </button>
//               </div>
//             </ModalHeader>
//             <ModalBody className="p-0">
//               <div className="max-h-[600px] md:max-h-[520px] overflow-y-auto flex flex-col gap-4 px-2">
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   Özəlliklər
//                 </h3>
//                 <div className="flex gap-2">
//                   <div
//                     className={`flex items-center gap-3 cursor-pointer transition-all duration-300 p-2 rounded-xl border ${
//                       sosialIsActive
//                         ? "bg-blue-100 border-blue-500 text-blue-700"
//                         : "bg-gray-50 border-gray-300 text-gray-700"
//                     } hover:shadow-md`}
//                     onClick={() => {
//                       setSosialIsActive(!sosialIsActive);
//                     }}
//                   >
//                     {sosialIsActive ? (
//                       <FaCheckCircle className="text-blue-600 text-xl" />
//                     ) : (
//                       <FaRegCircle className="text-gray-400 text-xl" />
//                     )}
//                     <span className="text-base">Sosial şəbəkə taskı</span>
//                   </div>
//                   <div
//                     className={`flex items-center gap-3 cursor-pointer transition-all duration-300 p-2 rounded-xl border ${
//                       teamWorkIsActive
//                         ? "bg-blue-100 border-blue-500 text-blue-700"
//                         : "bg-gray-50 border-gray-300 text-gray-700"
//                     } hover:shadow-md`}
//                     onClick={() => {
//                       setTeamWorkIsActive(!teamWorkIsActive);
//                       setValue("teamWorkIsActive", !teamWorkIsActive);
//                       setValue("deadline", undefined);
//                       setValue("started", undefined);
//                       clearErrors("started");
//                       clearErrors("deadline");
//                       resetSelectedUsers();
//                     }}
//                   >
//                     {teamWorkIsActive ? (
//                       <FaCheckCircle className="text-blue-600 text-xl" />
//                     ) : (
//                       <FaRegCircle className="text-gray-400 text-xl" />
//                     )}
//                     <span className="text-base">Komanda işi</span>
//                   </div>
//                 </div>

//                 {/* Title Field */}
//                 <div>
//                   <Input
//                     labelPlacement="outside"
//                     autoFocus
//                     label="Task"
//                     placeholder="Task başlığını qeyd edin"
//                     isInvalid={!!errors.title}
//                     errorMessage={errors.title?.message}
//                     {...register("title")}
//                   />
//                 </div>

//                 {/* Description Field */}
//                 <div>
//                   <Textarea
//                     labelPlacement="outside"
//                     label="Xüsusi qeyd"
//                     placeholder="Qeydinizi daxil edin"
//                     isInvalid={!!errors.content}
//                     errorMessage={errors.content?.message}
//                     {...register("content")}
//                   />
//                 </div>

//                 {/* Sosyal Medya Görevleri Bölümü */}
//                 {sosialIsActive && (
//                   <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
//                     <h3 className="text-lg font-semibold text-blue-700 mb-3">
//                       Sosial şəbəkə taskı
//                     </h3>

//                     {/* Sosyal Medya Platformu Seçimi */}
//                     <div className="mb-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-3">
//                         Platform
//                       </label>
//                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                         {[
//                           {
//                             name: "İnstaqram",
//                             color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
//                             icon: <FaInstagram className="w-5 h-5" />
//                           },
//                           {
//                             name: "Facebook",
//                             color: "bg-[#1877F2]",
//                             icon: <FaFacebookF className="w-5 h-5" />
//                           },
//                           {
//                             name: "TikTok",
//                             color: "bg-black",
//                             icon: <FaTiktok className="w-5 h-5" />
//                           },
//                           { 
//                             name: "YouTube", 
//                             color: "bg-[#FF0000]", 
//                             icon: <FaYoutube className="w-5 h-5" />
//                           },
//                         ].map((platform) => {
//                           const hasSelectedContent = Object.keys(contentTypes).some(key => 
//                             key.startsWith(platform.name)
//                           );
//                           const isSelected = selectedPlatform === platform.name || hasSelectedContent;

//                           return (
//                             <button
//                               key={platform.name}
//                               type="button"
//                               onClick={() => setSelectedPlatform(platform.name)}
//                               className={`
//                                   group relative overflow-hidden
//                                   ${isSelected
//                                     ? "ring-2 ring-blue-500 scale-105 shadow-lg"
//                                     : "hover:ring-1 hover:ring-gray-300"
//                                   }
//                                   ${platform.color} text-white p-3 rounded-xl
//                                   flex flex-col items-center justify-center gap-1
//                                   transition-all duration-300 h-16
//                                   hover:brightness-110
//                                 `}
//                             >
//                               <div className="relative z-10 flex flex-col items-center gap-1">
//                                 {platform.icon}
//                                 <span className="text-xs font-medium">
//                                   {platform.name}
//                                 </span>
//                               </div>
//                               {hasSelectedContent && (
//                                 <div className="absolute top-1 left-1 w-2 h-2 bg-green-400 rounded-full ring-1 ring-white"></div>
//                               )}
//                               {selectedPlatform === platform.name && (
//                                 <>
//                                   <div className="absolute inset-0 bg-white/10"></div>
//                                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
//                                   <div className="absolute top-1.5 right-1.5">
//                                     <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
//                                       <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                                       </svg>
//                                     </div>
//                                   </div>
//                                 </>
//                               )}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>

//                     {/* Seçili Platformlar */}
//                     {Object.keys(contentTypes).length > 0 && (
//                       <div className="mb-4">
//                         <div className="flex flex-wrap gap-2">
//                           {Object.entries(contentTypes).map(([key, value]) => {
//                             const [platform, type] = key.split(" - ");
//                             const isActivePlatform = platform === selectedPlatform;
//                             return (
//                               <div 
//                                 key={key} 
//                                 className={`
//                                   flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm
//                                   ${isActivePlatform 
//                                     ? "bg-blue-50 border border-blue-200" 
//                                     : "bg-gray-50"
//                                   }
//                                 `}
//                               >
//                                 <span className={`font-medium ${isActivePlatform ? "text-blue-700" : "text-gray-700"}`}>
//                                   {platform}
//                                 </span>
//                                 <span className="text-gray-500">-</span>
//                                 <span className={isActivePlatform ? "text-blue-600" : "text-gray-600"}>
//                                   {type}
//                                 </span>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     )}

//                     {/* Kontent Növü Seçimi */}
//                     {selectedPlatform && (
//                       <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-3">
//                           Kontent növü
//                         </label>
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                           {getContentTypesForPlatform(selectedPlatform).map((type) => (
//                             <label
//                               key={type}
//                               className={`
//                                 relative flex items-center p-3 rounded-xl cursor-pointer
//                                 ${contentTypes[`${selectedPlatform} - ${type}`]
//                                   ? "bg-blue-50 border-2 border-blue-500"
//                                   : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
//                                 }
//                                 transition-all duration-200
//                               `}
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={contentTypes[`${selectedPlatform} - ${type}`] || false}
//                                 onChange={() => handleContentTypeChange(selectedPlatform, type)}
//                                 className="sr-only"
//                               />
//                               <div className="flex items-center gap-2">
//                                 <div className={`
//                                   w-5 h-5 rounded border-2 flex items-center justify-center
//                                   ${contentTypes[`${selectedPlatform} - ${type}`]
//                                     ? "border-blue-500 bg-blue-500"
//                                     : "border-gray-300"
//                                   }
//                                 `}>
//                                   {contentTypes[`${selectedPlatform} - ${type}`] && (
//                                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                     </svg>
//                                   )}
//                                 </div>
//                                 <span className={`
//                                   text-sm font-medium
//                                   ${contentTypes[`${selectedPlatform} - ${type}`]
//                                     ? "text-blue-700"
//                                     : "text-gray-700"
//                                   }
//                                 `}>
//                                   {type}
//                                 </span>
//                               </div>
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {planning && planning.planning_posts.length > 0 && (
//                   <div>
//                     <label>Planlama postu</label>
//                     <Controller
//                       name="planning_post"
//                       control={control}
//                       render={({ field }) => (
//                         <div>
//                           <PlanningPostListModal
//                             onSelect={(e) => {
//                               field.onChange(e.id);
//                             }}
//                           />
//                           {errors.planning_post?.message && (
//                             <p className="text-red-500 text-sm md:text-[16px] mt-1">
//                               {String(errors.planning_post.message)}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     />
//                   </div>
//                 )}

//                 <div>
//                   <label>Təsdiq edəcək şəxs</label>
//                   <div className="mt-[8px]">
//                     <CheckerSelect
//                       placeholder="Seçin"
//                       options={projectMembers.filter(
//                         (item) => item.status.key !== "pending"
//                       )}
//                       onSelect={(e) => setSelectedTaskChecker(e)}
//                     />
//                   </div>
//                 </div>

//                 {!teamWorkIsActive && (
//                   <div>
//                     <label>İcra edəcək şəxs</label>
//                     <div className="mt-[8px]">
//                       <AssignerSelect
//                         placeholder="Seçin"
//                         error={errors.assigner?.message}
//                         options={projectMembers.filter(
//                           (item) => item.status.key !== "pending"
//                         )}
//                         onSelect={(e) => {
//                           setSelectedAssigner(e);
//                           setValue("assigner", e?.id);
//                           trigger();
//                         }}
//                       />
//                       {errors.assigner && (
//                         <p className="text-red-500 text-sm md:text-[16px] mt-1">
//                           {errors.assigner.message}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* File Field */}
//                 <div>
//                   <div className="flex justify-between items-center">
//                     <label>Fayl</label>
//                     <button type="button" onClick={handleAddFile}>
//                       <Plus color="primary" />
//                     </button>
//                   </div>
//                   <div>
//                     {taskFiles.map((file, index) => (
//                       <div
//                         className="flex justify-between items-center gap-2"
//                         key={index}
//                       >
//                         <FileUpload
//                           id={`main_file_${index}`}
//                           onChange={(file) => handleFileChange(file, index)}
//                           selectedFile={file}
//                         />
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveFile(index)}
//                         >
//                           <Trash />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {!teamWorkIsActive && (
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* DateTime Field */}
//                     <div>
//                       <Controller
//                         name="started"
//                         control={control}
//                         render={({ field }) => (
//                           <div>
//                             <DatePicker
//                               id="started_1000"
//                               value={field.value || ""}
//                               onChange={(date) => {
//                                 field.onChange(date);
//                                 setStarted(date);
//                                 clearErrors("started");
//                               }}
//                               label="Başlama tarixi"
//                               disableDatePrevious={new Date()}
//                             />
//                             {errors.started && (
//                               <p className="text-red-500 text-sm md:text-[16px] mt-1">
//                                 {errors.started.message}
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       />
//                     </div>

//                     {/* DateTime Field */}
//                     <div>
//                       <Controller
//                         name="deadline"
//                         control={control}
//                         render={({ field }) => (
//                           <div>
//                             <DatePicker
//                               id="deadline_1000"
//                               value={field.value || ""}
//                               onChange={(date) => {
//                                 field.onChange(date);
//                                 setDeadline(date);
//                                 clearErrors("deadline");
//                               }}
//                               label="Bitmə tarixi"
//                               disableDatePrevious={new Date(started)}
//                             />
//                             {errors.deadline && (
//                               <p className="text-red-500 text-sm md:text-[16px] mt-1">
//                                 {errors.deadline.message}
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {teamWorkIsActive && (
//                   <>
//                     <div>
//                       <div>
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-[8px]">
//                             <label>Subtasklar</label>
//                             {selectedUsers.length > 0 && (
//                               <SelectUserTaskModal />
//                             )}
//                           </div>
//                           {selectedUsers.length > 0 && (
//                             <div className="flex items-center gap-[2px]">
//                               <div className="w-[12px] h-[12px] bg-custom-red rounded-full"></div>
//                               -
//                               <span className="text-[12px] leading-[16px] text-t-black">
//                                 Xəta var
//                               </span>
//                             </div>
//                           )}
//                         </div>

//                         <div className="mt-[16px] flex items-center gap-[8px]">
//                           <div className="flex flex-wrap items-center gap-[8px]">
//                             {selectedUsers.map((user, index) => {
//                               const hasError =
//                                 errorMessages[user.order] &&
//                                 Object.values(errorMessages[user.order]).some(
//                                   (value) =>
//                                     Array.isArray(value) && value.length > 0
//                                 );
//                               return (
//                                 <div
//                                   onClick={() => setSelectedUser(user)}
//                                   key={index}
//                                   className={`${
//                                     user.order === selectedUser?.order
//                                       ? "bg-primary text-white"
//                                       : "bg-[#E8E9FF] hover:bg-[#cfd1ff] text-primary"
//                                   } relative cursor-pointer rounded-[12px]  h-[40px] group flex gap-[6px] items-center px-[12px]`}
//                                 >
//                                   {user.order === selectedUser?.order ? (
//                                     <div className="grid place-items-center w-[14px] h-[14px] bg-white rounded-full">
//                                       <div className="grid place-items-center w-[10px] h-[10px] bg-primary rounded-full">
//                                         <div
//                                           className={`${
//                                             user.order ===
//                                               selectedUser?.order && "bg-white"
//                                           } grid place-items-center w-[6px] h-[6px] group-hover:bg-white rounded-full`}
//                                         ></div>
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     <div className="grid place-items-center w-[16px] h-[16px] border-[2px] border-primary rounded-full"></div>
//                                   )}
//                                   <span className="text-[14px] font-[500]">
//                                     {user.projectMember.user.first_name}
//                                   </span>
//                                   <button
//                                     onClick={() => removeUser(user.order)}
//                                     className="ml-2"
//                                     type="button"
//                                   >
//                                     <Close
//                                       color={
//                                         user.order === selectedUser?.order
//                                           ? "white"
//                                           : "var(--primary)"
//                                       }
//                                       size={16}
//                                     />
//                                   </button>
//                                   {hasError && (
//                                     <div className="absolute right-[5px] top-[-5px] w-[12px] h-[12px] bg-custom-red rounded-full"></div>
//                                   )}
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="">
//                         {selectedUsers.map((item, index) => {
//                           const parentUser = selectedUsers.find(
//                             (user) =>
//                               selectedUser &&
//                               user.nextSubtaskTemp === selectedUser.order - 1
//                           );
//                           return (
//                             item.order === selectedUser?.order && (
//                               <div key={index} className="pt-[20px] space-y-4">
//                                 {/* Content */}
//                                 <div>
//                                   <Input
//                                     labelPlacement="outside"
//                                     label="Task"
//                                     placeholder="Task başlığını qeyd edin"
//                                     value={item.job || ""}
//                                     onChange={(
//                                       e: React.ChangeEvent<HTMLInputElement>
//                                     ) =>
//                                       updateUserJob(item.order, e.target.value)
//                                     }
//                                   />
//                                   {errorMessages[item.order] &&
//                                     errorMessages[item.order].job && (
//                                       <p className="text-red-500 text-sm">
//                                         {errorMessages[item.order].job}
//                                       </p>
//                                     )}
//                                 </div>
//                                 {/* Content */}
//                                 <div>
//                                   <Textarea
//                                     labelPlacement="outside"
//                                     label="Xüsusi qeyd"
//                                     placeholder="Qeydinizi daxil edin"
//                                     value={item.content}
//                                     onChange={(
//                                       e: React.ChangeEvent<HTMLTextAreaElement>
//                                     ) =>
//                                       updateUserContent(
//                                         item.order,
//                                         e.target.value
//                                       )
//                                     }
//                                   />
//                                   {errorMessages[item.order] &&
//                                     errorMessages[item.order].content && (
//                                       <p className="text-red-500 text-sm">
//                                         {errorMessages[item.order].content}
//                                       </p>
//                                     )}
//                                 </div>

//                                 <div>
//                                   <label>Təsdiq edəcək şəxs</label>
//                                   <div className="mt-[8px]">
//                                     <CheckerSelect
//                                       placeholder="Seçin"
//                                       value={item.taskChecker}
//                                       options={projectMembers}
//                                       onSelect={(e) =>
//                                         updateUserTaskChecker(
//                                           item.order,
//                                           e || undefined
//                                         )
//                                       }
//                                     />
//                                   </div>
//                                 </div>

//                                 <div>
//                                   <label>Növbəti tapşırıq</label>
//                                   <div className="mt-[8px]">
//                                     <SubtaskSelect
//                                       placeholder="Seçin"
//                                       value={item.nextSubtaskTemp}
//                                       options={selectedUsers.filter(
//                                         (user) => user.order > item.order
//                                       )}
//                                       onSelect={(e) =>
//                                         updateUserNextSubtaskTemp(
//                                           item.order,
//                                           (e && e.order - 1) || null
//                                         )
//                                       }
//                                     />
//                                   </div>
//                                 </div>

//                                 <div>
//                                   <div className="flex justify-between items-center">
//                                     <label>Fayl</label>
//                                     <button
//                                       type="button"
//                                       onClick={() => addUserFile(item.order)}
//                                     >
//                                       <Plus color="primary" />
//                                     </button>
//                                   </div>
//                                   <div>
//                                     {item.files?.map((file, fileIndex) => (
//                                       <div
//                                         className="flex justify-between items-center gap-2"
//                                         key={`useritem_${index}_file_${fileIndex}`}
//                                       >
//                                         <FileUpload
//                                           id={`user_${index}_file_${fileIndex}`}
//                                           onChange={
//                                             (file) =>
//                                               updateUserFile(
//                                                 item.order,
//                                                 file,
//                                                 fileIndex
//                                               )
//                                           }
//                                           selectedFile={file}
//                                         />
//                                         <button
//                                           type="button"
//                                           onClick={() =>
//                                             removeUserFile(
//                                               item.order,
//                                               fileIndex
//                                             )
//                                           }
//                                         >
//                                           <Trash />
//                                         </button>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                                 <div
//                                   key={index}
//                                   className="pt-[20px] grid grid-cols-2 gap-[20px]"
//                                 >
//                                   {/* Başlama Tarixi */}
//                                   <div>
//                                     <DatePicker
//                                       id={`started_${index}`}
//                                       value={item.started || ""}
//                                       onChange={(e) =>
//                                         updateUserStarted(
//                                           item.order,
//                                           e,
//                                           item.timeLimit
//                                         )
//                                       }
//                                       label="Başlama tarixi"
//                                     />
//                                     {errorMessages[item.order] &&
//                                       errorMessages[item.order].started && (
//                                         <p className="text-red-500 text-sm">
//                                           {errorMessages[item.order].started}
//                                         </p>
//                                       )}
//                                   </div>

//                                   {/* Bitmə Tarixi */}
//                                   <div>
//                                     <DatePicker
//                                       id={`deadline_${index}`}
//                                       value={item.deadline || ""}
//                                       onChange={(e) =>
//                                         updateUserDeadline(item.order, e)
//                                       }
//                                       label="Bitmə tarixi"
//                                     />
//                                     {errorMessages[item.order] &&
//                                       errorMessages[item.order].deadline && (
//                                         <p className="text-red-500 text-sm">
//                                           {errorMessages[item.order].deadline}
//                                         </p>
//                                       )}
//                                   </div>
//                                 </div>
//                               </div>
//                             )
//                           );
//                         })}
//                       </div>
//                     </div>
//                     {errors.root && (
//                       <div className="mb-4 text-red-500 text-sm">
//                         {errors.root.message}
//                       </div>
//                     )}
//                     {selectedUsers.length === 0 && !errors.subtasks_count && (
//                       <div className="flex justify-center items-center">
//                         <div className="text-center space-y-6 max-w-md mx-auto p-1">
//                           <div className="relative">
//                             <div className="w-24 h-24 mx-auto mb-4 relative">
//                               <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
//                               <div className="relative flex items-center justify-center w-full h-full">
//                                 <svg
//                                   className="w-12 h-12 text-gray-400"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={1.5}
//                                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                                   />
//                                 </svg>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="space-y-3">
//                             <h3 className="text-lg font-semibold text-gray-700">
//                               Hələ heç kim seçilməyib
//                             </h3>
//                             <p className="text-gray-500 text-sm leading-relaxed">
//                               İstifadəçi seçmək üçün klik edin
//                             </p>
//                           </div>

//                           <div className="flex justify-center space-x-2 opacity-60">
//                             <div
//                               className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
//                               style={{ animationDelay: "0ms" }}
//                             ></div>
//                             <div
//                               className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
//                               style={{ animationDelay: "150ms" }}
//                             ></div>
//                             <div
//                               className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"
//                               style={{ animationDelay: "300ms" }}
//                             ></div>
//                           </div>

//                           <div className="pt-4">
//                             <SelectUserTaskModal />
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {selectedUsers.length === 0 && errors.subtasks_count && (
//                       <div className="flex justify-center items-center">
//                         <div className="text-center space-y-6 max-w-md mx-auto p-1 border-2 border-red-200 rounded-xl bg-red-50">
//                           <div className="relative">
//                             <div className="w-24 h-24 mx-auto mb-4 relative">
//                               <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-rose-200 rounded-full animate-pulse"></div>
//                               <div className="relative flex items-center justify-center w-full h-full">
//                                 <svg
//                                   className="w-12 h-12 text-red-500"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
//                                   />
//                                 </svg>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="space-y-3">
//                             <h3 className="text-lg font-semibold text-red-700">
//                               İstifadəçi seçilməlidir!
//                             </h3>
//                             <p className="text-red-600 text-sm leading-relaxed font-medium">
//                               Davam etmək üçün ən azı bir istifadəçi seçin
//                             </p>
//                           </div>

//                           <div className="flex justify-center space-x-2 opacity-80">
//                             <div
//                               className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
//                               style={{ animationDelay: "0ms" }}
//                             ></div>
//                             <div
//                               className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
//                               style={{ animationDelay: "150ms" }}
//                             ></div>
//                             <div
//                               className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
//                               style={{ animationDelay: "300ms" }}
//                             ></div>
//                           </div>

//                           <div className="pt-4 space-y-2">
//                             <SelectUserTaskModal />
//                             <p className="text-xs text-red-500 font-medium">
//                               ⚠️ Bu sahə mütləqdir
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//               {selectedUsers.length > 0 && (
//                 <div className="hidden md:block fixed top-[10px] right-[10px] transform rounded-lg p-4 bg-white shadow-lg z-50 max-w-[400px] w-full">
//                   <h2 className="text-lg font-semibold text-gray-800 mb-3">
//                     Seçilmiş istifadəçilər
//                   </h2>
//                   <div className="space-y-4">
//                     {selectedUsers.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center gap-4 p-3 bg-gray-50 rounded-md shadow-sm"
//                       >
//                         <span className="text-gray-600 font-medium">
//                           {item.order}.
//                         </span>
//                         <div className="flex-grow">
//                           <div className="text-t-black">
//                             <span className="font-[600]">
//                               {item.projectMember.user.full_name}{" "}
//                             </span>
//                             <span>
//                               {item.profession &&
//                                 "- " +
//                                   item.profession +
//                                   " - " +
//                                   item.timeLimit +
//                                   " Dəqiqə"}
//                             </span>
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {item.started && formatDate(item.started)}{" "}
//                             {item.started && "-"}{" "}
//                             {item.deadline && formatDate(item.deadline)}
//                           </div>
//                           {item.nextSubtaskTemp ? (
//                             <div className="bg-gray-200 p-1 mt-2 rounded-md">
//                               {item.nextSubtaskTemp
//                                 ? `Sonrakı tapşırıq - ${
//                                     selectedUsers.find(
//                                       (u) =>
//                                         u.order - 1 === item.nextSubtaskTemp
//                                     )?.order
//                                   }. ${
//                                     selectedUsers.find(
//                                       (u) =>
//                                         u.order - 1 === item.nextSubtaskTemp
//                                     )?.projectMember.user.full_name
//                                   }`
//                                 : ""}
//                             </div>
//                           ) : (
//                             ""
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </ModalBody>
//             <ModalFooter className="grid grid-cols-2 gap-[16px]">
//               <Button
//                 className="bg-custom-gray font-[500]"
//                 variant="flat"
//                 onClick={onOpenChange}
//                 type="button"
//               >
//                 Ləğv et
//               </Button>
//               <Button
//                 className="bg-primary text-white font-[500]"
//                 type="submit"
//               >
//                 Yadda saxla
//               </Button>
//             </ModalFooter>
//           </form>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default EditTaskModal;

import React from 'react'

const EditTask = () => {
  return (
    <div>EditTask</div>
  )
}

export default EditTask
