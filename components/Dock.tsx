import React from 'react';
import { BitcoinDock, defaultBitcoinApps } from '@bitcoin-os/mini-dock-status-bar';

const Dock: React.FC = () => {
  return (
    <BitcoinDock 
      apps={defaultBitcoinApps} 
      currentApp="Bitcoin Art"
    />
  );
};

export default Dock;