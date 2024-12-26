import React from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: 20px;
`;

const Settings: React.FC = () => {
  return (
    <SettingsContainer>
      <h1>Settings</h1>
      {/* Add your settings form here */}
    </SettingsContainer>
  );
};

export default Settings; 