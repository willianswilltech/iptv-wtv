
import React, { useState } from 'react';
import { Plan } from '../types';
import PlanFormModal from './PlanFormModal';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PlanManagementProps {
  plans: Plan[];
  onAddPlan: (plan: Omit<Plan, 'id'>) => void;
  onUpdatePlan: (plan: Plan) => void;
  onDeletePlan: (planId: string) => void;
}

const PlanManagement: React.FC<PlanManagementProps> = ({ plans, onAddPlan, onUpdatePlan, onDeletePlan }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const handleOpenModal = (plan: Plan | null = null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingPlan(null);
    setIsModalOpen(false);
  };

  const handleSavePlan = (plan: Plan) => {
    if (editingPlan) {
      onUpdatePlan({ ...plan, id: editingPlan.id });
    } else {
      onAddPlan(plan);
    }
    handleCloseModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Planos</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Adicionar Plano
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome do Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor Mensal</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {plans.map(plan => (
                <tr key={plan.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{plan.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{plan.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">R$ {plan.monthlyValue.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(plan)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                       <PencilIcon className="h-5 w-5"/>
                    </button>
                    <button onClick={() => onDeletePlan(plan.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <TrashIcon className="h-5 w-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PlanFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePlan}
        plan={editingPlan}
      />
    </div>
  );
};

export default PlanManagement;
