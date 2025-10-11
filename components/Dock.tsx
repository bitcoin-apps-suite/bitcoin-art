import React from 'react';
import { BitcoinDock, defaultBitcoinApps } from '@bitcoin-os/dock';

const Dock: React.FC = () => {
  return (
    <BitcoinDock 
      apps={defaultBitcoinApps} 
      currentApp="Bitcoin Art"
    />
  );
};

export default Dock;