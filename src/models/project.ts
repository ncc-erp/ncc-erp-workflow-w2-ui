export const projectList : IProjects[] = []

export interface IProjects {
    "name": string,
    "code": string,
    "pm": IPM[],
}

export interface IPM {
    "fullName": string,
    "emailAddress": string
}