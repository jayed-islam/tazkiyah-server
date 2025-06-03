export const instituteFilterableFields: string[] = [
  "searchTerm",
  "name",
  "type",
  "gender",
  "companyId",
];

export const instituteSearchableFields: string[] = [
  "name",
  "description",
  "address",
];

export const instituteRelationalFields: string[] = [
  "company",
  "students",
  "programs",
];

export const instituteRelationalFieldsMapper: { [key: string]: string } = {
  company: "company",
  students: "students",
  programs: "programs",
};

export const INSTITUTE_TYPES = [
  "SCHOOL",
  "COLLEGE",
  "UNIVERSITY",
  "MADRASA",
  "TRAINING_CENTER",
] as const;

export const GENDER_TYPES = ["MALE", "FEMALE", "MIXED"] as const;
