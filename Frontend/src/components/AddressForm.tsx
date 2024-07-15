import React from 'react';
import { AddressComponents } from '../types/types';
import InputField from './InputField';

// Define field labels for address components
const FIELD_LABELS: Record<keyof AddressComponents, string> = {
    fromAddress: "Street Name & Number",
    city: "City",
    state: "State",
    zip: "ZIP Code",
};

// Define props interface for AddressForm component
interface AddressFormProps {
    // Address components state
    addressComponents: AddressComponents;
    // Function to handle input changes
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // Function to check if the form is valid
    isFormValid: () => boolean;
    // Function to fetch data
    fetchData: () => void;
    // Loading indicator
    loading: boolean;
}

// AddressForm component
// Renders input fields for address components and a submit button
const AddressForm: React.FC<AddressFormProps> = ({
    addressComponents,
    handleInputChange,
    isFormValid,
    fetchData,
    loading,
}) => {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <div className="row g-3">
                    {/* Render input fields for each address component */}
                    {(Object.keys(addressComponents) as Array<keyof AddressComponents>).map((key) => (
                        <div key={key} className="col-md-6">
                            {/* Render InputField component for each address component */}
                            <InputField
                                name={key}
                                value={addressComponents[key]}
                                onChange={handleInputChange}
                                placeholder={FIELD_LABELS[key]}
                                className="form-control"
                            />
                        </div>
                    ))}
                </div>
                <div className="d-grid gap-2 mt-3">
                    {/* Submit button */}
                    <button
                        onClick={fetchData}
                        disabled={loading || !isFormValid()}
                        className="btn btn-primary"
                    >
                        {/* Show spinner if loading */}
                        {loading ? (
                            <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        ) : (
                            "Get Forecast"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressForm;