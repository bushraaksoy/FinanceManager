import { PdfReader } from 'pdfreader';

export const parsePdf = (path) => {
    new PdfReader().parseFileItems('path', (err, item) => {
        if (err) {
            console.log(err);
        } else if (!item) {
            console.log('end of file...');
        } else if (item.text) {
            console.log(item.text);
        }
    });
};
