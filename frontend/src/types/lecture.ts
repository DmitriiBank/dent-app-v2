
export type LectureStatus = 'done' | 'available' | 'locked';

export type Lecture = {
    id: string;                 // slug, например "lecture-1"
    title: string;              // "Лекция 1"
    subtitle: string;           // "Введение в стоматологию"
    iconUrl: string;            // /assets/icons/...
    status: LectureStatus;      // done/available/locked
    pdfUrl: string;             // /static/lectures/<id>.pdf
};

export const LECTURES: Lecture[] = [
    {
        id: 'lecture-1',
        title: 'Лекция 1',
        subtitle: 'Введение в стоматологию',
        iconUrl: './image/icon_1.png',
        status: 'done',
        pdfUrl: './lectures/lecture-1.pdf',
    }
    // ...добавляй дальше
];