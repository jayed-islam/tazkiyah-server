export const companyFilterableFields: string[] = [
  "searchTerm",
  "name",
  "email",
  "phone",
  "isActive",
];

export const companySearchableFields: string[] = [
  "name",
  "description",
  "email",
  "address",
];

export const companyRelationalFields: string[] = [
  "employees",
  "institutes",
  "programs",
  "tasks",
];

export const companyRelationalFieldsMapper: { [key: string]: string } = {
  employees: "employees",
  institutes: "institutes",
  programs: "programs",
  tasks: "tasks",
};
