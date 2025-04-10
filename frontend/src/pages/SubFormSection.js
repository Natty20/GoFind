import React from 'react';
import PropTypes from 'prop-types';

const SubFormSection = ({ label, fields, values, onChange }) => {
  const handleChange = (index, fieldName, value) => {
    const updated = [...values];
    updated[index][fieldName] = value;
    onChange(updated);
  };

  const handleAdd = () => {
    const newEntry = {};
    fields.forEach((f) => (newEntry[f.name] = ''));
    onChange([...values, newEntry]);
  };

  const handleRemove = (index) => {
    const updated = values.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="my-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      {values.map((entry, index) => (
        <div key={index} className="mb-4 border p-3 rounded bg-gray-50">
          {fields.map((field) => (
            <div key={field.name} className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                value={entry[field.name]}
                onChange={(e) =>
                  handleChange(index, field.name, e.target.value)
                }
                className="mt-1 p-2 block w-full border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="mt-2 text-red-600 hover:underline text-sm"
          >
            Supprimer cette sous-prestation
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 text-blue-600 hover:underline text-sm"
      >
        ➕ Ajouter une sous-prestation
      </button>
    </div>
  );
};

SubFormSection.propTypes = {
  label: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SubFormSection;
