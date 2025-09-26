'use client';

import React from 'react';
import { DevelopmentDashboard } from '../../../components/development/DevelopmentDashboard';
import { DevelopmentStage } from '../../../lib/development-stage-manager';

export default function DevelopmentFlowPage() {
  const handleStageChange = (stage: DevelopmentStage) => {
    console.log('Stage changed to:', stage);
  };

  const handleTaskComplete = (taskId: string) => {
    console.log('Task completed:', taskId);
  };

  return (
    <DevelopmentDashboard
      initialStage={DevelopmentStage.STATIC}
      onStageChange={handleStageChange}
      onTaskComplete={handleTaskComplete}
    />
  );
}