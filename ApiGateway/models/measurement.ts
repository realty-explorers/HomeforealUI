import MeasurementEntry from './measurementEntry';
import Unit from './unit';
interface Measurement {
	time: Date;
	description: string;
	overallStatus: string;
	dataId: string;
	testPlanId: string;
	testPlanName: string;
	unit: Unit;
	inputPort: number;
	outputPort: number;
}

export default Measurement;
