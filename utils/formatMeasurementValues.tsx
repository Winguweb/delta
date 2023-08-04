import React from "react";
import { SAMPLE_PARAMETER_ICONS } from "../config/samples";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import capitalize from "./capitalize";
import Text from "../components/molecules/Text";

export const formatMeasurementValues = (items: Record<string, number> | null | undefined) => {
  
  const formatName = (name:string)=>{    
    return name.split(' ')[0].toLowerCase()
  }

  if (items) {
    const parseItems = Object.entries(items).map(([name, value]) => ({
      icon: SAMPLE_PARAMETER_ICONS[formatName(name)] ?? <StarIcon />,
      children: (
        <React.Fragment key={name}>
          <Text as="p2" className="ml-2 py-0 font-semibold text-sm">
            {capitalize(name.split(' ')[0])} <Text as="span2" className='!font-normal'>{value}</Text>
          </Text>
        </React.Fragment>
      ),
    }));
    return parseItems;
  } else {
    return [
      {
        icon: <XMarkIcon />,
        children: (
          <React.Fragment>
            <Text as="p2" className="ml-1 py-0 font-semibold text-sm">
              No se encontraron muestras cargadas
            </Text>
          </React.Fragment>
        ),
      },
    ];
  }

};
