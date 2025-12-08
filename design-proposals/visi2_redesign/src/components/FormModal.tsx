import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FormModal({ isOpen, onClose }: FormModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isArtist, setIsArtist] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    cep: '',
    renda: '',
    // Adicionar mais campos conforme necessário
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Lógica de submissão
    console.log('Formulário enviado', formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-white z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-black text-white p-8 md:p-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 rounded-full opacity-50" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
                  CADASTRO DE ARTISTA
                </h2>
                <p className="text-gray-300 max-w-3xl">
                  Preencha o formulário abaixo para fazer parte do mapeamento Visibilidade em Foco. 
                  Seus dados serão tratados com total segurança e privacidade.
                </p>
              </div>

              <button
                onClick={onClose}
                className="absolute top-8 right-8 z-20 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Content */}
            <div className="h-[calc(100%-200px)] overflow-y-auto p-8 md:p-10 lg:p-12">
              <AnimatePresence mode="wait">
                {/* Step 0 - Pergunta inicial */}
                {currentStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-1 bg-purple-600" />
                        <span className="text-sm tracking-widest text-gray-500">PERGUNTA INICIAL</span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl lg:text-4xl tracking-tight leading-tight mb-2">
                        Você responde este formulário como pessoa artista LGBTQIAPN+ morador(a/e) do município de São Roque?
                      </h3>
                      <span className="text-pink-500 text-xl">*</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <button
                        onClick={() => {
                          setIsArtist(true);
                          handleNext();
                        }}
                        className={`group relative p-8 border-4 transition-all duration-300 ${
                          isArtist === true 
                            ? 'border-orange-500 bg-orange-500 text-white' 
                            : 'border-gray-200 hover:border-orange-500'
                        }`}
                      >
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-4 border-current" />
                        {isArtist === true && (
                          <div className="absolute top-6 right-6 w-4 h-4 bg-white rounded-full" />
                        )}
                        <div className="text-3xl md:text-4xl tracking-tight">SIM</div>
                      </button>

                      <button
                        onClick={() => setIsArtist(false)}
                        className={`group relative p-8 border-4 transition-all duration-300 ${
                          isArtist === false 
                            ? 'border-gray-600 bg-gray-600 text-white' 
                            : 'border-gray-200 hover:border-gray-600'
                        }`}
                      >
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-4 border-current" />
                        {isArtist === false && (
                          <div className="absolute top-6 right-6 w-4 h-4 bg-white rounded-full" />
                        )}
                        <div className="text-3xl md:text-4xl tracking-tight">NÃO</div>
                      </button>
                    </div>

                    {isArtist === false && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-gray-100 p-6 border-l-4 border-gray-600"
                      >
                        <p className="text-gray-700">
                          Este formulário é destinado exclusivamente para artistas LGBTQIAPN+ residentes em São Roque.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 1 - Dados pessoais */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-1 bg-purple-600" />
                        <span className="text-sm tracking-widest text-gray-500">BLOCO 1 DE 3 - DADOS PESSOAIS</span>
                      </div>
                    </div>

                    {/* Campo CEP */}
                    <div className="mb-8 bg-stone-50 p-8 border-l-4 border-purple-600">
                      <div className="mb-6">
                        <h4 className="mb-2 tracking-tight">PRIVACIDADE E PROTEÇÃO DE DADOS:</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Seus dados serão utilizados exclusivamente para o projeto Visibilidade em Foco e não serão compartilhados com terceiros sem seu consentimento. 
                          Você pode solicitar a remoção das suas informações a qualquer momento.
                        </p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block mb-4">
                        <span className="text-xl tracking-tight mb-2 block">
                          Qual é o seu CEP? <span className="text-pink-500">*</span>
                        </span>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="00000-000"
                            value={formData.cep}
                            onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                            className="w-full px-6 py-4 border-4 border-gray-200 focus:border-purple-600 outline-none text-xl transition-colors"
                            maxLength={9}
                          />
                          <div className="absolute top-4 left-4 w-6 h-6 border-2 border-gray-400 rounded-full" />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Digite o CEP e o endereço será preenchido automaticamente
                        </p>
                      </label>
                    </div>

                    {/* Adicionar mais campos aqui conforme necessário */}
                  </motion.div>
                )}

                {/* Step 2 - Renda */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-1 bg-purple-600" />
                        <span className="text-sm tracking-widest text-gray-500">DADOS SOCIOECONÔMICOS</span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl tracking-tight mb-2">
                        Qual é a sua renda familiar mensal?
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {[
                        'Até 2 salários mínimos',
                        'De 3 a 4 salários mínimos',
                        'De 5 a 8 salários mínimos',
                        'Acima de 8 salários mínimos',
                        'Prefiro não responder'
                      ].map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setFormData({ ...formData, renda: option })}
                          className={`w-full text-left p-6 border-4 transition-all duration-300 group ${
                            formData.renda === option
                              ? 'border-purple-600 bg-purple-600 text-white'
                              : 'border-gray-200 hover:border-purple-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{option}</span>
                            <div className={`w-6 h-6 rounded-full border-4 transition-colors ${
                              formData.renda === option 
                                ? 'border-white' 
                                : 'border-gray-400'
                            }`}>
                              {formData.renda === option && (
                                <div className="w-full h-full bg-white rounded-full scale-50" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer com navegação */}
            <div className="absolute bottom-0 left-0 right-0 bg-stone-100 p-6 md:p-8 border-t-4 border-black">
              <div className="max-w-4xl mx-auto">
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm tracking-widest text-gray-600">
                      BLOCO {currentStep + 1} DE {totalSteps}
                    </span>
                    <span className="text-sm text-gray-600">DADOS PESSOAIS</span>
                  </div>
                  <div className="h-2 bg-gray-300 relative">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  {currentStep > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-8 py-4 border-4 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span className="tracking-wide">VOLTAR</span>
                    </button>
                  )}

                  {currentStep < totalSteps - 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={currentStep === 0 && isArtist !== true}
                      className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="tracking-wide text-lg">CONTINUAR</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white transition-all duration-300"
                    >
                      <span className="tracking-wide text-lg">ENVIAR CADASTRO</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
