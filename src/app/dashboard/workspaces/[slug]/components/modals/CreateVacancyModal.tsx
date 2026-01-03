'use client'
import Plus from '@/app/dashboard/components/ui/icons/Plus'
import { zodResolver } from '@hookform/resolvers/zod';
import Button from "@/components/ui/Button"
import Modal, { useDisclosure } from "@/components/ui/modal/Modal";
import { ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal/ModalContent"; 
import Select, { SelectItem } from "@/components/ui/form/Select";
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useVacancyStore } from '@/store/vacancy.store';



const schema = z.object({
  title: z.string().min(1, "Bu sahə tələb olunur"), // Required string
  startDate: z.string().min(1, "Bu sahə tələb olunur"), // Required date (as string)
  category: z.string().min(1, "Bu sahə tələb olunur"), // Required category
  address: z.string().min(1, "Bu sahə tələb olunur"), // Required address
  experience: z.string().optional(), // Optional text field
  descriptions: z.array(z.string().min(1, "Bu sahə boş ola bilməz")).optional(), // Array of non-empty strings
  requirements: z.array(z.string().min(1, "Bu sahə boş ola bilməz")).optional(), // Array of non-empty strings
  company: z.string().min(1, "Bu sahə tələb olunur"), // Required company name
  endDate: z.string().optional(), // Optional date field
  worktime: z.string().optional(), // Worktime selection (dropdown)
  workregime: z.string().optional(), // Work regime selection (dropdown)
  salary: z.string().optional(), // Optional salary field
});

type FormData = z.infer<typeof schema>;


interface Description {
  id: number
  value: string
}

interface Requirements {
  id: number
  value: string
}


const CreateVacancyModal = () => {
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [requirements, setRequirements] = useState<Requirements[]>([]);
  const { workModes, workSchedulers, vacancyCategories } = useVacancyStore();


  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDescriptionInput = () => {
    setDescriptions([...descriptions, { id: descriptions.length + 1, value: "" }]);
  };

  const handleRequirementInput = () => {
    setRequirements([...requirements, { id: requirements.length + 1, value: "" }]);
  };

  const handleDescriptionChange = (id: number, newValue: string) => {
    setDescriptions((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, value: newValue } : input
      )
    );
  };

  const handleRequirementChange = (id: number, newValue: string) => {
    setRequirements((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, value: newValue } : input
      )
    );
  };

  const {
    register,
    handleSubmit,
    // formState: { errors },
    // reset,
    // setError
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);

  }



  return (
    <>
      <Button onClick={onOpen} variant="primary" className="rounded-[8px] text-white text-[14px] font-medium flex items-center h-[44px] px-[16px] gap-[8px] w-full md:w-auto">
        <Plus />
        <span>Vakansiya yarat</span>
      </Button>
      <Modal className='custom-container p-[20px]!' isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent className=''>
          <ModalHeader className='flex items-center justify-between'>
            Vakansiya yarat
          </ModalHeader>
          <ModalBody className='max-h-[438px] overflow-y-auto custom-scrollbar'>
            <form>
              <div>
                <div className="flex items-center justify-center bg-opacity-50">
                  <div className="bg-white w-full">
                    <div className="grid grid-cols-2 gap-[72px]">
                      {/* Left Side */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Vakansiya adı</label>
                          <input
                            {...register("title", { required: "Bu sahə tələb olunur" })}
                            type="text"
                            placeholder="Vakansiya başlığını qeyd edin"
                            className="w-full p-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Vakansiyanın başlama tarixi</label>
                          <input
                            {...register("startDate", { required: "Bu sahə tələb olunur" })}
                            type="date"
                            className="w-full p-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Ünvan</label>
                          <input
                            {...register("address", { required: "Bu sahə tələb olunur" })}
                            type="text"
                            className="w-full p-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black"
                            placeholder="Ünvanınızı daxil edin"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Təcrübə</label>
                          <input
                            {...register("experience")}
                            type="text"
                            placeholder="Təcrübənizi daxil edin"
                            className="w-full p-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">İş barədə məlumat</label>
                          <button
                            onClick={handleDescriptionInput}
                            type="button"
                            className="text-black focus:outline-hidden"
                          >
                            + Məlumat
                          </button>
                          <div className="space-y-[10px] mt-[10px]">
                            {descriptions.map((description, index) => (
                              <input
                                {...register(`descriptions.${index}`)}
                                key={description.id}
                                type="text"
                                value={description.value}
                                onChange={(e) => handleDescriptionChange(description.id, e.target.value)}
                                placeholder="Yeni məlumat daxil edin"
                                className="w-full p-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Tələblər</label>
                          <button
                            onClick={handleRequirementInput}
                            type="button"
                            className="text-black focus:outline-hidden"
                          >
                            + Tələb
                          </button>
                          <div className="space-y-[10px] mt-[10px]">
                            {requirements.map((requirement, index) => (
                              <input
                                {...register(`requirements.${index}`)}
                                key={requirement.id}
                                type="text"
                                value={requirement.value}
                                onChange={(e) => handleRequirementChange(requirement.id, e.target.value)}
                                placeholder="Yeni məlumat daxil edin"
                                className="w-full p-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Vakansiya müəssisəsi</label>
                          <input
                            {...register("company", { required: "Bu sahə tələb olunur" })}
                            type="text"
                            placeholder="Müəssisənin adını qeyd edin"
                            className="w-full p-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Vakansiyanın bitmə tarixi</label>
                          <input
                            {...register("endDate")}
                            type="date"
                            className="w-full p-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Kateqoriya</label>
                          <Select
                            {...register("category")}
                            className="border rounded-lg"
                            placeholder="Kateqoriya seçin"
                          >
                            {vacancyCategories.map((category) => (
                              <SelectItem key={category.id} value={String(category.id)}>
                                {category.title}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">İş saatı</label>
                          <Select
                            {...register("worktime")}
                            className="border rounded-lg"
                            placeholder="Tam ştat"
                          >
                            {workModes.map((worktime) => (
                              <SelectItem key={worktime.id} value={String(worktime.id)}>
                                {worktime.title}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">İş rejimi</label>
                          <Select
                            {...register("workregime")}
                            className="border rounded-lg"
                            placeholder="Tam ştat"
                          >
                            {workSchedulers.map((workregime) => (
                              <SelectItem key={workregime.id} value={String(workregime.id)}>
                                {workregime.title}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Maaş</label>
                          <input
                            {...register("salary")}
                            type="text"
                            placeholder="Maaşınızı qeyd edin"
                            className="w-full p-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

          </ModalBody>
          <ModalFooter className='px-6 py-0'>
            <div className="mt-6 text-right">
              <button
                onClick={handleSubmit(onSubmit)}
                type="button"
                className="bg-primary min-w-[196px] text-white py-[8px] rounded-lg hover:bg-blue-600 focus:outline-hidden"
              >
                Göndər
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateVacancyModal
