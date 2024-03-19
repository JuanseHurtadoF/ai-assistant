import { IoAirplane } from "react-icons/io5";

type FlightInfoProps = {
  flightInfo: {
    flightNumber: string;
    departure: string;
    arrival: string;
    status: string;
  };
};

const FlightInfo = ({ flightInfo }: FlightInfoProps) => {
  return (
    <div className="p-4 bg-slate-50 border-slate-200 border-2 w-auto rounded-md shadow-sm min-w-80">
      <p className="text-slate-400 text-md">
        {flightInfo.flightNumber} - <span>{flightInfo.status}</span>
      </p>
      <div className="grid grid-cols-3 justify-items-center">
        <p className="text-sky-400 text-2xl font-light w-full text-left">
          {flightInfo.departure}
        </p>
        <div className="flex items-center">
          <IoAirplane color="#0ea5e9" />
        </div>
        <p className="text-sky-400 text-2xl font-light w-full text-right">
          {flightInfo.arrival}
        </p>
      </div>
      <div className="grid grid-cols-3 justify-items-center">
        <p className="text-slate-400 text-sm font-light w-full text-left">
          11:15AM
        </p>
        <p className="text-slate-800 text-sm font-light">1h50</p>
        <p className="text-slate-400 text-sm font-light w-full text-right">
          2:05PM
        </p>
      </div>
    </div>
  );
};

export { FlightInfo };
