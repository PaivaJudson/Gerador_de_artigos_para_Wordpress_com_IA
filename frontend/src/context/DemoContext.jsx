import { createContext, useContext, useMemo } from 'react'

const mockUser = { full_name: 'Usuário Demo', email: 'demo@exemplo.com' }

const mockArticles = [
  {
    id: 1,
    title: 'Benefícios da meditação para produtividade no trabalho',
    excerpt: 'A meditação pode melhorar o foco e reduzir o estresse no ambiente corporativo. Conheça práticas simples para começar...',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Como criar conteúdo para WordPress com IA',
    excerpt: 'Ferramentas de inteligência artificial estão revolucionando a criação de artigos. Veja como usar a IA a seu favor...',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

const mockArticlesFull = {
  1: {
    id: 1,
    title: 'Benefícios da meditação para produtividade no trabalho',
    excerpt: 'A meditação pode melhorar o foco e reduzir o estresse no ambiente corporativo. Conheça práticas simples para começar no dia a dia.',
    content: `
    <p>A meditação deixou de ser uma prática restrita a ambientes religiosos e passou a ser adotada por empresas e profissionais que buscam mais foco e menos estresse.</p>
    <h2>Por que meditar no trabalho?</h2>
    <p>Estudos mostram que poucos minutos de prática diária podem melhorar a concentração e a tomada de decisões. Além disso, reduz a ansiedade e o cansaço mental.</p>
    <h2>Como começar</h2>
    <ul>
      <li>Reserve 5 a 10 minutos por dia</li>
      <li>Escolha um lugar tranquilo</li>
      <li>Use apps ou áudios guiados se preferir</li>
    </ul>
    <p>Experimente incluir a meditação na sua rotina e observe os resultados no trabalho e na vida pessoal.</p>
  `,
    model_used: 'gpt-4o-mini',
    created_at: new Date().toISOString(),
  },
  2: {
    id: 2,
    title: 'Como criar conteúdo para WordPress com IA',
    excerpt: 'Ferramentas de inteligência artificial estão revolucionando a criação de artigos. Veja como usar a IA a seu favor...',
    content: `
    <p>A inteligência artificial está transformando a forma como criamos conteúdo para a web. Para WordPress, já existem ferramentas que ajudam desde a pesquisa até a redação.</p>
    <h2>Vantagens de usar IA no conteúdo</h2>
    <p>Além de agilizar a produção, a IA pode sugerir títulos, melhorar a SEO e manter um tom consistente em vários artigos.</p>
    <h2>Boas práticas</h2>
    <ul>
      <li>Revise e personalize o texto gerado</li>
      <li>Use a IA como apoio, não como substituto total</li>
      <li>Mantenha a voz da sua marca</li>
    </ul>
    <p>Com o uso consciente da IA, você pode escalar sua produção de conteúdo sem perder qualidade.</p>
  `,
    model_used: 'gpt-4o-mini',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
}

const DemoContext = createContext(null)

export function DemoProvider({ children }) {
  const value = useMemo(
    () => ({
      isDemo: true,
      user: mockUser,
      articles: mockArticles,
      getArticle: (id) => mockArticlesFull[Number(id)] || null,
    }),
    []
  )
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  return useContext(DemoContext)
}
