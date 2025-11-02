import React from 'react';

const TestView: React.FC = () => {
  return (
    <div className="card page-content">
      <h2>Page de Test</h2>
      <div className="static-content">
        <p>Ceci est une nouvelle page créée à partir de zéro pour les tests.</p>
        <p>Vous pouvez ajouter ici n'importe quel composant ou contenu que vous souhaitez tester.</p>
        <button className="button-link">Bouton de test</button>
      </div>
    </div>
  );
};

export default TestView;
