import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export type DateOfBirth = {
  day: number;
  month: string;
  year: number;
};


export const getAge = (dob?: DateOfBirth): number | null => {
  if (!dob?.day || !dob?.month || !dob?.year) return null;

  const birthDate = new Date(`${dob.month} ${dob.day}, ${dob.year}`);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

//////////////

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const timeAgo = (dateString: string) => {
  return dayjs(dateString).fromNow();
};

export const formDataFromCreatedAt = (createdAt: any) => {

   return new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

};
