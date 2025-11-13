
import React, { useState, useEffect } from 'react';
import { Plan } from '../types';
import Modal from './ui/Modal';

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
  plan: Plan | null;
}

const initialPlanState: Omit<Plan, 'id'> = {
  name: '',
  description: '',
  monthlyValue: 0,
};

const PlanFormModal: React.FC<PlanFormModalProps> = ({ isOpen, onClose, onSave, plan }) => {
  const [formData, setFormData] = useState<Omit<Plan, 'id'>>(initialPlanState);

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    } else {
      setFormData(initialPlanState);
    }
  }, [plan, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Plan);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={plan ? 'Editar Plano' : 'Adicionar Plano'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Plano</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="monthlyValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor Mensal (R$)</label>
          <input
            type="number"
            name="monthlyValue"
            id="monthlyValue"
            value={formData.monthlyValue}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default PlanFormModal;
