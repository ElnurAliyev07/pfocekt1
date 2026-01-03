import React from "react";
import Image from "next/image";
import Star from "../../components/ui/icons/Star";
import Location from "../../components/ui/icons/Location";

const Page = () => {
  return (
    <div>
      <div
        className="fs1container w-[110%] bg-[#E8EAED] rounded-[12px]
        p-[32px] pr-[33px] pb-[32px] pl-[33px] gap-[10px] relative"
      >
        <div className="profile-header w-100 flex justify-between items-center mb-5">
          <span className="text-[28px] font-medium">Profil</span>
          <span className="text-t-gray text-[14px] font-medium">
            Qoşuldu 10 Avg 2024
          </span>
        </div>
        <div
          className="profile-main w-[75%] h-auto
          flex flex-col gap-[18px]"
        >
          <div className="profile-p1 flex gap-4">
            <div className="profile-photo">
              <Image
                src="/profilepicture.png"
                width={112}
                height={112}
                className="rounded-full"
                alt="profilepicture"
              />
            </div>
            <div className="profile-info flex flex-col gap-[6px]">
              <p className="text-[20px] font-medium">Ayaz Samadov</p>
              <p className="text-t-gray text-[16px] font-medium">
                Product Designer
              </p>
              <div className="flex items-center gap-1.5 text-primary">
                <Star />
                <span className="text-sm font-medium leading-4 text-[12px]">
                  4.5
                </span>
              </div>
              <div className="flex items-center gap-[2px]">
                <Location />
                <span className="text-t-gray text-[12px] font-medium">
                  Bakı, Azərbaycan
                </span>
              </div>
            </div>
          </div>
          <div className="profile-p2 flex items-center gap-[14px]">
            <div className="bg-[#F3F6FC] pt-[8px] pb-[8px] pl-[10px] pr-[12px] rounded-[48px] text-[12px] font-medium">
              UX/UI Dizayner
            </div>
            <div className="bg-[#F3F6FC] pt-[8px] pb-[8px] pl-[10px] pr-[12px] rounded-[48px] text-[12px] font-medium">
              Məhsul Dizayneri
            </div>
            <div className="bg-[#F3F6FC] pt-[8px] pb-[8px] pl-[10px] pr-[12px] rounded-[48px] text-[12px] font-medium">
              Web Dizayner
            </div>
            <div className="bg-[#F3F6FC] pt-[8px] pb-[8px] pl-[10px] pr-[12px] rounded-[48px] text-[12px] font-medium">
              UI Dizayner
            </div>
          </div>
        </div>
      </div>
      <div
        className="right-sidebar absolute w-[24%] h-auto
      right-[103px] top-[270px] flex flex-col gap-8"
      >
        <div
          className="bg-white pt-8 pr-6 pb-8 pl-6 rounded-[20px]
         flex flex-col gap-10"
        >
          <div className="flex flex-col gap-2">
            <p>
              2000 AZN<span className="text-t-gray font-medium">/Aylıq</span>
            </p>
            <p>
              700 AZN
              <span className="text-t-gray font-medium">/Proyekt başı</span>
            </p>
            <p>
              500 AZN<span className="text-t-gray font-medium">/Paket</span>
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-[4px]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.8758 2.5H13.1258C12.96 2.5 12.8011 2.56585 12.6839 2.68306C12.5666 2.80027 12.5008 2.95924 12.5008 3.125C12.5008 3.29076 12.5666 3.44973 12.6839 3.56694C12.8011 3.68415 12.96 3.75 13.1258 3.75H15.3672L12.0805 7.03672C10.839 6.02193 9.255 5.5231 7.65606 5.64341C6.05713 5.76372 4.5656 6.49396 3.48995 7.68309C2.4143 8.87223 1.83682 10.4293 1.87696 12.0322C1.9171 13.6352 2.57177 15.1614 3.70558 16.2952C4.8394 17.429 6.36561 18.0837 7.96856 18.1238C9.57151 18.164 11.1286 17.5865 12.3177 16.5108C13.5068 15.4352 14.2371 13.9437 14.3574 12.3447C14.4777 10.7458 13.9789 9.16179 12.9641 7.92031L16.2508 4.63438V6.875C16.2508 7.04076 16.3166 7.19973 16.4339 7.31694C16.5511 7.43415 16.71 7.5 16.8758 7.5C17.0416 7.5 17.2005 7.43415 17.3177 7.31694C17.4349 7.19973 17.5008 7.04076 17.5008 6.875V3.125C17.5008 2.95924 17.4349 2.80027 17.3177 2.68306C17.2005 2.56585 17.0416 2.5 16.8758 2.5ZM11.6602 15.4133C10.9608 16.1123 10.0699 16.5883 9.10006 16.781C8.13021 16.9738 7.125 16.8746 6.2115 16.4961C5.298 16.1176 4.51724 15.4768 3.96793 14.6546C3.41862 13.8324 3.12543 12.8658 3.12543 11.877C3.12543 10.8881 3.41862 9.92153 3.96793 9.09934C4.51724 8.27714 5.298 7.63627 6.2115 7.25777C7.125 6.87927 8.13021 6.78012 9.10006 6.97286C10.0699 7.16561 10.9608 7.64159 11.6602 8.34063C12.5964 9.27939 13.1222 10.5511 13.1222 11.877C13.1222 13.2028 12.5964 14.4745 11.6602 15.4133Z"
                    fill="#64717C"
                  />
                </svg>
                <span className="text-t-gray font-medium">Cins</span>
              </div>
              <div>
                <span className="font-medium">Kişi</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-[4px]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.7257 12.5582L8.60898 10.4665L8.63398 10.4415C10.0462 8.87273 11.1011 7.01609 11.7257 4.99984H14.1673V3.33317H8.33398V1.6665H6.66732V3.33317H0.833984V4.99984H10.1423C9.58398 6.59984 8.70065 8.12484 7.50065 9.45817C6.72565 8.59984 6.08398 7.65817 5.57565 6.6665H3.90898C4.51732 8.02484 5.35065 9.30817 6.39232 10.4665L2.15065 14.6498L3.33398 15.8332L7.50065 11.6665L10.0923 14.2582L10.7257 12.5582ZM15.4173 8.33317H13.7507L10.0007 18.3332H11.6673L12.6007 15.8332H16.559L17.5007 18.3332H19.1673L15.4173 8.33317ZM13.234 14.1665L14.584 10.5582L15.934 14.1665H13.234Z"
                    fill="#64717C"
                  />
                </svg>
                <span className="text-t-gray font-medium">İngilis dili</span>
              </div>
              <div>
                <span className="font-medium">Əla</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-[4px]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.7257 12.5582L8.60898 10.4665L8.63398 10.4415C10.0462 8.87273 11.1011 7.01609 11.7257 4.99984H14.1673V3.33317H8.33398V1.6665H6.66732V3.33317H0.833984V4.99984H10.1423C9.58398 6.59984 8.70065 8.12484 7.50065 9.45817C6.72565 8.59984 6.08398 7.65817 5.57565 6.6665H3.90898C4.51732 8.02484 5.35065 9.30817 6.39232 10.4665L2.15065 14.6498L3.33398 15.8332L7.50065 11.6665L10.0923 14.2582L10.7257 12.5582ZM15.4173 8.33317H13.7507L10.0007 18.3332H11.6673L12.6007 15.8332H16.559L17.5007 18.3332H19.1673L15.4173 8.33317ZM13.234 14.1665L14.584 10.5582L15.934 14.1665H13.234Z"
                    fill="#64717C"
                  />
                </svg>
                <span className="text-t-gray font-medium">Alman dili</span>
              </div>
              <div>
                <span className="font-medium">Orta</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white pt-8 pr-6 pb-8 pl-6 rounded-[20px]
         flex flex-col gap-5"
        >
          <p className="font-medium text-[20px]">Bacarıqlar</p>
          <hr />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <span className="bg-[#F3F6FC] pt-1 pr-4 pb-1 pl-4 rounded-[36px] font-medium text-[12px]">
                Figma
              </span>
              <span className="bg-[#F3F6FC] pt-1 pr-4 pb-1 pl-4 rounded-[36px] font-medium text-[12px]">
                Web Design
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-[#F3F6FC] pt-1 pr-4 pb-1 pl-4 rounded-[36px] font-medium text-[12px]">
                Mobile App Design
              </span>
              <span className="bg-[#F3F6FC] pt-1 pr-4 pb-1 pl-4 rounded-[36px] font-medium text-[12px]">
                Sketch
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-[#F3F6FC] pt-1 pr-4 pb-1 pl-4 rounded-[36px] font-medium text-[12px]">
                SAAS
              </span>
              <span className="bg-[#F3F6FC] pt-1 pr-4 pb-1 pl-4 rounded-[36px] font-medium text-[12px]">
                Prototyping
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="info-sec w-[65%] h-auto mt-[25px] 
        flex flex-col gap-[25px]"
      >
        <div
          className="about-sec bg-white rounded-[12px] h-auto pt-8 pr-6 pb-8 pl-6
        flex flex-col gap-[16px]"
        >
          <p className="font-medium text-[20px]">Haqqında</p>
          <hr />
          <p className="text-t-gray">
            Lorem ipsum dolor sit amet consectetur. Enim lacus cras mattis
            lectus suspendisse eu cras. Lectus sed iaculis mi ac et condimentum.
            Eget dignissim adipiscing nulla sem leo. Lectus nibh leo elementum
            facilisis. Lorem ipsum dolor sit amet consectetur.
          </p>
        </div>
        <div
          className="edu-sec bg-white rounded-[12px] h-auto
        pt-8 pr-6 pb-8 pl-6 flex flex-col gap-[18px]"
        >
          <p className="font-medium text-[20px]">Təhsil</p>
          <hr />
          <div className="flex gap-5">
            <Image src="/steps.png" width={16} height={387} alt="steps" />
            <div className="flex flex-col justify-between">
              <div>
                <div
                  className="bg-[#F3F6FC] w-auto inline-block rounded-[36px] 
                    pt-2 pr-4 pb-2 pl-4 font-medium text-[14px] mb-2"
                >
                  2021-2024
                </div>
                <div className="flex flex-col gap-3.5">
                  <p className="font-medium text-[20px]">Dizayner</p>
                  <p className="text-t-gray font-medium">
                    Bakı Dövlət Universiteti
                  </p>
                  <p className="text-t-gray text-[14px]">
                    Lorem ipsum dolor sit amet consectetur. Enim lacus cras
                    mattis lectus suspendisse eu cras. Lectus sed iaculis mi ac
                    et condimentum.
                  </p>
                </div>
              </div>
              <div>
                <div
                  className="bg-[#F3F6FC] w-auto inline-block rounded-[36px] 
                    pt-2 pr-4 pb-2 pl-4 font-medium text-[14px] mb-2"
                >
                  2021-2024
                </div>
                <div className="flex flex-col gap-3.5">
                  <p className="font-medium text-[20px]">Dizayner</p>
                  <p className="text-t-gray font-medium">
                    Bakı Dövlət Universiteti
                  </p>
                  <p className="text-t-gray text-[14px]">
                    Lorem ipsum dolor sit amet consectetur. Enim lacus cras
                    mattis lectus suspendisse eu cras. Lectus sed iaculis mi ac
                    et condimentum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="experience-sec bg-white rounded-[12px] h-auto
        pt-8 pr-6 pb-8 pl-6 flex flex-col gap-[18px]"
        >
          <p className="font-medium text-[20px]">İş Təcrübəsi</p>
          <hr />
          <div className="flex gap-5">
            <Image src="/steps.png" width={16} height={387} alt="steps" />
            <div className="flex flex-col justify-between">
              <div>
                <div
                  className="bg-[#F3F6FC] w-auto inline-block rounded-[36px] 
                    pt-2 pr-4 pb-2 pl-4 font-medium text-[14px] mb-2"
                >
                  2021-2024
                </div>
                <div className="flex flex-col gap-3.5">
                  <p className="font-medium text-[20px]">Dizayner</p>
                  <p className="text-t-gray font-medium">VR Production</p>
                  <p className="text-t-gray text-[14px]">
                    Lorem ipsum dolor sit amet consectetur. Enim lacus cras
                    mattis lectus suspendisse eu cras. Lectus sed iaculis mi ac
                    et condimentum.
                  </p>
                </div>
              </div>
              <div>
                <div
                  className="bg-[#F3F6FC] w-auto inline-block rounded-[36px] 
                    pt-2 pr-4 pb-2 pl-4 font-medium text-[14px] mb-2"
                >
                  2021-2024
                </div>
                <div className="flex flex-col gap-3.5">
                  <p className="font-medium text-[20px]">Dizayner</p>
                  <p className="text-t-gray font-medium">VR Production</p>
                  <p className="text-t-gray text-[14px]">
                    Lorem ipsum dolor sit amet consectetur. Enim lacus cras
                    mattis lectus suspendisse eu cras. Lectus sed iaculis mi ac
                    et condimentum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="sertifikat-sec bg-white rounded-[12px] h-auto
        pt-8 pr-6 pb-8 pl-6 flex flex-col gap-[18px]"
        >
          <p className="font-medium text-[20px]">Sertifikatlar</p>
          <hr />
          <div className="flex gap-5">
            <Image src="/steps.png" width={16} height={387} alt="steps" />
            <div className="flex flex-col justify-between">
              <div>
                <div
                  className="bg-[#F3F6FC] w-auto inline-block rounded-[36px] 
                    pt-2 pr-4 pb-2 pl-4 font-medium text-[14px] mb-2"
                >
                  2021-2024
                </div>
                <div className="flex flex-col gap-3.5">
                  <p className="font-medium text-[20px]">Dizayner</p>
                  <p className="text-t-gray font-medium">Udemy</p>
                  <p className="text-t-gray text-[14px]">
                    Lorem ipsum dolor sit amet consectetur. Enim lacus cras
                    mattis lectus suspendisse eu cras. Lectus sed iaculis mi ac
                    et condimentum.
                  </p>
                </div>
              </div>
              <div>
                <div
                  className="bg-[#F3F6FC] w-auto inline-block rounded-[36px] 
                    pt-2 pr-4 pb-2 pl-4 font-medium text-[14px] mb-2"
                >
                  2021-2024
                </div>
                <div className="flex flex-col gap-3.5">
                  <p className="font-medium text-[20px]">Dizayner</p>
                  <p className="text-t-gray font-medium">Udemy</p>
                  <p className="text-t-gray text-[14px]">
                    Lorem ipsum dolor sit amet consectetur. Enim lacus cras
                    mattis lectus suspendisse eu cras. Lectus sed iaculis mi ac
                    et condimentum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="comments-sec bg-white rounded-[12px] h-auto p-[32px] 
        flex flex-col gap-[24px]"
        >
          <div className="flex flex-col gap-[12px]">
            <p className="font-medium text-[20px]">Rəylər</p>
            <hr />
            <p className="text-t-gray">8 Rəy</p>
            <div className="flex item-center justify-between">
              <span className="font-medium">Rəy yaz</span>
              <div className="flex gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0008 17.75L5.82881 20.995L7.00781 14.122L2.00781 9.25495L8.90781 8.25495L11.9938 2.00195L15.0798 8.25495L21.9798 9.25495L16.9798 14.122L18.1588 20.995L12.0008 17.75Z"
                    stroke="#444BD3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0008 17.75L5.82881 20.995L7.00781 14.122L2.00781 9.25495L8.90781 8.25495L11.9938 2.00195L15.0798 8.25495L21.9798 9.25495L16.9798 14.122L18.1588 20.995L12.0008 17.75Z"
                    stroke="#444BD3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0008 17.75L5.82881 20.995L7.00781 14.122L2.00781 9.25495L8.90781 8.25495L11.9938 2.00195L15.0798 8.25495L21.9798 9.25495L16.9798 14.122L18.1588 20.995L12.0008 17.75Z"
                    stroke="#444BD3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0008 17.75L5.82881 20.995L7.00781 14.122L2.00781 9.25495L8.90781 8.25495L11.9938 2.00195L15.0798 8.25495L21.9798 9.25495L16.9798 14.122L18.1588 20.995L12.0008 17.75Z"
                    stroke="#444BD3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0008 17.75L5.82881 20.995L7.00781 14.122L2.00781 9.25495L8.90781 8.25495L11.9938 2.00195L15.0798 8.25495L21.9798 9.25495L16.9798 14.122L18.1588 20.995L12.0008 17.75Z"
                    stroke="#444BD3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full h-auto relative pt-[15px]">
              <input
                type="text"
                placeholder="Fikirlərinizi paylaşın"
                className="w-full border rounded-[16px]
            pt-3 pr-2 pb-3 pl-4 outline-hidden"
              />
              <button
                className="bg-primary w-auto h-[40px] pt-[10px] pr-4 pb-[10px] pl-4
            flex items-center justify-center rounded-[8px] text-white
            font-medium text-[14px] absolute right-0 top-[20px]"
              >
                Paylaş
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[24px]">
              <div className="flex gap-3">
                <Image
                  src="/commenterimg.png"
                  width={44}
                  height={44}
                  alt="commenter"
                />
                <div>
                  <p className="font-medium">Günel Qəmbərova</p>
                  <p className="text-t-gray font-medium text-[12px]">
                    12 Avqust 2024
                  </p>
                </div>
              </div>
              <p className="text-t-gray">
                Lorem ipsum dolor sit amet consectetur. Turpis semper vitae
                tellus netus. Consequat neque felis consectetur egestas
                porttitor integer adipiscing. Massa etiam fusce a cursus netus
                lectus. Tellus eget rhoncus vel dolor leo. In vel mi facilisis
                amet morbi dui purus nulla purus.
              </p>
            </div>
            <div className="flex flex-col gap-[24px]">
              <div className="flex gap-3">
                <Image
                  src="/commenterimg.png"
                  width={44}
                  height={44}
                  alt="commenter"
                />
                <div>
                  <p className="font-medium">Günel Qəmbərova</p>
                  <p className="text-t-gray font-medium text-[12px]">
                    12 Avqust 2024
                  </p>
                </div>
              </div>
              <p className="text-t-gray">
                Lorem ipsum dolor sit amet consectetur. Turpis semper vitae
                tellus netus. Consequat neque felis consectetur egestas
                porttitor integer adipiscing. Massa etiam fusce a cursus netus
                lectus. Tellus eget rhoncus vel dolor leo. In vel mi facilisis
                amet morbi dui purus nulla purus.
              </p>
            </div>
          </div>
          <a href="#" className="underline font-medium flex justify-end">
            Daha çox
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
