'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  description: string;
}

interface CheckoutStepsProps {
  currentStep: number;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { id: 1, name: 'Identificação', description: 'Dados pessoais' },
  { id: 2, name: 'Entrega', description: 'Endereço de entrega' },
  { id: 3, name: 'Pagamento', description: 'Forma de pagamento' },
  { id: 4, name: 'Confirmação', description: 'Revise e confirme' },
];

export default function CheckoutSteps({ currentStep, steps = defaultSteps }: CheckoutStepsProps) {
  return (
    <div className="w-full">
      {/* Desktop Version */}
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={stepIdx !== steps.length - 1 ? 'flex-1' : ''}>
                <div className="flex items-center">
                  <div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step.id < currentStep
                        ? 'bg-primary border-primary'
                        : step.id === currentStep
                        ? 'bg-white border-primary'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span
                        className={`text-sm font-medium ${
                          step.id === currentStep ? 'text-primary' : 'text-gray-500'
                        }`}
                      >
                        {step.id}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        step.id < currentStep ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Etapa {currentStep} de {steps.length}
          </p>
          <div className="flex space-x-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`h-2 w-8 rounded-full ${
                  step.id <= currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <h2 className="text-lg font-semibold">
          {steps.find((s) => s.id === currentStep)?.name}
        </h2>
        <p className="text-sm text-gray-600">
          {steps.find((s) => s.id === currentStep)?.description}
        </p>
      </div>
    </div>
  );
}
