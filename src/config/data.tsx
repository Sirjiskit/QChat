import { IComboBox } from "../interface";

export const DepartmentsList: Array<IComboBox> = [
    { value: 1, label: 'Accountancy Department' },
    { value: 2, label: 'Agric. and Bio-Environmental Engineering Technology' },
    { value: 3, label: 'Animal Health and Production Technology' },
    { value: 4, label: 'Building Technology' },
    { value: 5, label: 'Business Administration and Management' },
    { value: 6, label: 'Civil Engineering' },
    { value: 7, label: 'Computer Engineering' },
    { value: 8, label: 'Computer Science' },
    { value: 9, label: 'Crop Production Technology' },
    { value: 10, label: 'Electrical/Electronic Engineering' },
    { value: 11, label: 'Electrical/Electronic Engineering' },
    { value: 12, label: 'General Studies' },
    { value: 13, label: 'Office Technology and Management' },
    { value: 14, label: 'Public Administration' },
    { value: 15, label: 'Science Laboratory Technology' },
    { value: 16, label: 'Statistics' },
];
export const getDpmById = (id: any) => {
    const dpm = DepartmentsList.slice().filter((x: IComboBox) => x.value == id);
    return dpm.length > 0 ? dpm[0].label : 'Unknown';
}