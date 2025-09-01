import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Calendar, Clock, Target, Loader2 } from 'lucide-react';

const AnaliseAvancada = () => {
  const location = useLocation();
  const fight = location.state?.fight;
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string>('');

  useEffect(() => {
    if (fight) {
      generateAnalysis();
    }
  }, [fight]);

  const generateAnalysis = async () => {
    setIsLoadingAnalysis(true);
    setAnalysisError('');
    
    try {
      const prompt = `Gere uma análise pré-luta para uma página da web sobre o confronto do UFC entre ${fight.fighter1} e ${fight.fighter2}. O texto deve ser conciso, direto e de fácil leitura, ideal para consumo rápido. Evite parágrafos longos e foque nos pontos mais importantes. Sua análise deve cobrir: primeiro, um resumo do confronto de estilos, destacando o principal ponto forte e a maior vulnerabilidade de cada lutador e como isso impacta a luta. Segundo, a visão geral da comunidade e dos analistas sobre as narrativas do combate. Por fim, um prognóstico final, indicando o vencedor, o método mais provável e a principal chave para a vitória de cada um. Lembre sua resposta será impressa em HTML, entao nao utilize markdown, apenas use <b> para negrito e deixe o texto organizado e legivel formatado.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyAIsiMa5-P6jk4pTHDj1DqyV9DXrlSszxU'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar análise');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      setAnalysis(generatedText);
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
      setAnalysisError('Erro ao gerar análise. Tente novamente mais tarde.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  if (!fight) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-black via-gray-900 to-red-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Análise Avançada</h1>
            <p className="text-gray-400 mb-8">Informações da luta não encontradas</p>
            <Link
              to="/fights"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Voltar para Lutas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-black via-gray-900 to-red-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Análise Avançada</h1>
            <p className="text-gray-400">Análise detalhada da luta</p>
          </div>
          <Link
            to="/fights"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
        </div>

        {/* Fight Info */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{fight.event}</h2>
              <p className="text-gray-400">{fight.weightClass} • {fight.title || 'Luta Principal'}</p>
            </div>
            <div className="text-right text-gray-400">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(fight.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{fight.time}</span>
              </div>
            </div>
          </div>

          {/* Fighters */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Fighter 1 */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  #1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{fight.fighter1}</h3>
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Red Corner</div>
                <div className="text-red-400 font-semibold mt-1">redFighter</div>
              </div>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">VS</div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Categoria</div>
                  <div className="text-white font-semibold mt-1">{fight.weightClass}</div>
                </div>
              </div>
            </div>

            {/* Fighter 2 */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  #2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{fight.fighter2}</h3>
              <div className="bg-gray-800/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Blue Corner</div>
                <div className="text-blue-400 font-semibold mt-1">blueFighter</div>
              </div>
            </div>
          </div>

          {/* Fight Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/30 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-sm">Rounds</div>
              <div className="text-white font-semibold mt-1">{fight.rounds}</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-sm">Duração</div>
              <div className="text-white font-semibold mt-1">{fight.duration}</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-sm">Título</div>
              <div className="text-white font-semibold mt-1">{fight.weightClass}</div>
            </div>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Análise IA Avançada</h3>
            <button
              onClick={generateAnalysis}
              disabled={isLoadingAnalysis}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white rounded-lg hover:from-amber-300 hover:via-yellow-400 hover:to-orange-400 transition-all duration-500 font-medium text-sm shadow-lg hover:shadow-xl border border-amber-300/40 hover:border-amber-200/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingAnalysis ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando...</span>
                </span>
              ) : (
                'Atualizar Análise'
              )}
            </button>
          </div>

          {isLoadingAnalysis && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-400">Gerando análise detalhada...</p>
            </div>
          )}

          {analysisError && (
            <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4 mb-4">
              <p className="text-red-400 font-semibold">{analysisError}</p>
            </div>
          )}

          {analysis && !isLoadingAnalysis && (
            <div className="prose prose-invert max-w-none">
              <div className="bg-gray-800/30 rounded-lg p-6">
                <div 
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: analysis }}
                />
              </div>
            </div>
          )}

          {!analysis && !isLoadingAnalysis && !analysisError && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Clique em "Atualizar Análise" para gerar uma análise detalhada da luta.</p>
            </div>
          )}
        </div>

        {/* Premium Content Placeholder */}
        <div className="glass-card p-8 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Conteúdo Premium</h3>
          <p className="text-gray-400 mb-6">
            Esta é a página de análise avançada para membros premium. 
            Aqui você encontrará análises detalhadas, estatísticas avançadas e insights exclusivos.
          </p>
          <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4">
            <p className="text-yellow-400 font-semibold">
              Análise avançada em desenvolvimento...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnaliseAvancada;
