import { Card, Form, Button, Alert } from 'react-bootstrap'

const MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (rápido e econômico)' },
  { value: 'gpt-4o', label: 'GPT-4o (mais capaz)' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
]

export default function GenerateDemo() {
  return (
    <>
      <h1 className="h4 mb-4">Gerar artigo com IA</h1>
      <Card>
        <Card.Body>
          <Alert variant="info" className="mb-3">
            Esta é a tela de geração de artigos. Faça <strong>login</strong> ou <strong>cadastre-se</strong> para gerar artigos reais com a OpenAI.
          </Alert>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tema ou prompt do artigo</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ex: Benefícios da meditação para produtividade no trabalho"
                readOnly
                className="bg-light"
              />
              <Form.Text className="text-muted">
                Descreva o assunto e, se quiser, o tom ou público-alvo.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Modelo OpenAI</Form.Label>
              <Form.Select disabled className="bg-light">
                {MODELS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Check type="switch" id="save-demo" label="Salvar artigo no banco após gerar" disabled />
            </Form.Group>
            <Button variant="primary" disabled>
              Gerar artigo (faça login para usar)
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
