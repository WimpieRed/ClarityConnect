import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TermForm } from '../components/TermForm/TermForm';

const TermFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSuccess = () => {
    if (id) {
      navigate(`/terms/${id}`);
    } else {
      navigate('/terms');
    }
  };

  return <TermForm termId={id} onSuccess={handleSuccess} />;
};

export default TermFormPage;

