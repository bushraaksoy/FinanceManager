import { PdfReader } from 'pdfreader';

new PdfReader().parseFileItems('bankstatement.pdf', (err, item) => {
    if (err) {
        console.log(err);
    } else if (!item) {
        console.log('end of file...');
    } else if (item.text) {
        console.log(item.text);
    }
});
