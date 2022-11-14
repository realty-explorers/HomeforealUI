import Measurement from './measurement';
import Unit from './unit';
interface TestPlanData {
	testPlanName: string;
	time: Date;
	unit: Unit;
	status: string;
	measurementsIds: string[];
}

export default TestPlanData;
