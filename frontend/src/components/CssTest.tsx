import React from 'react';

const CssTest: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">CSS Test Page</h1>
      
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-3">Card Component</h2>
        <p>This is a test card to verify CSS is working properly.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card bg-primary-100 p-4">
          <h3 className="text-lg font-medium text-primary-700">Tailwind Classes</h3>
          <p className="text-primary-600">This should have primary color text.</p>
        </div>
        
        <div className="card bg-vault-light p-4">
          <h3 className="text-lg font-medium text-vault-success">Custom CSS</h3>
          <p className="text-vault-info">This should have custom vault color text.</p>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-danger">Danger Button</button>
      </div>
    </div>
  );
};

export default CssTest;
