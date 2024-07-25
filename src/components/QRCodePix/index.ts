import { QrCodePix } from 'qrcode-pix';
import { IBanks } from '../../pages/Bancos/interface';
import moment from 'moment-timezone';
function generatePix (bank: IBanks, value: string|number, reference?: string|Date) {

    const bodyRequest = {
        version: '01',
        key: String(bank.pix_key),
        name: String(bank.owner_account_name),
        city: 'Sarzedo',
        value: +value,
        message: `DIZIMO REFERENTE A ${moment(reference).format("MM/YYYY")}`,
    }
    const pix = QrCodePix(bodyRequest);    
    const payload = pix.payload();

    return payload
}

export default generatePix