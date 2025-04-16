// reportFactory.js
import Report from '../models/report.js';
//
class ReportFactory {
    static createAppointment({ fullName, gender, email, doctor, date, time }) {
        // Additional validation or logic can be added here,future changes,encapsulate the creation logic of Report (appointment) objects
        return new Report({
            fullName,
            gender,
            email,
            doctor,
            date,
            time
        });
    }
}

export default ReportFactory;
