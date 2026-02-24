import {
  Box,
  Button,
  Checkbox,
  Divider,
  Field,
  Header,
  Input,
  ItemActive,
  Link,
  Message,
  Radio,
  Select,
  Sidebar,
  Text,
  Textarea,
} from './components'

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        style={{
          width: 260,
          padding: '1.5rem',
          flexShrink: 0,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Nav</h3>
        <nav>
          <ItemActive active>Dashboard</ItemActive>
          <ItemActive>Projects</ItemActive>
          <ItemActive>Settings</ItemActive>
        </nav>
        <Divider />
        <Text disabled>Sidebar #1A1A1A</Text>
      </Sidebar>

      <main
        style={{
          flex: 1,
          padding: '2rem',
          maxWidth: 720,
        }}
      >
        <Header
          style={{
            margin: '-2rem -2rem 2rem -2rem',
            padding: '1rem 2rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <h1 style={{ margin: 0 }}>UI Kit Demo</h1>
          <p
            style={{
              margin: '0.25rem 0 0',
              color: 'var(--color-text-disabled)',
            }}
          >
            Palette: #0A0A0A · #1A1A1A · #2D2D2D · #00E5FF · #F5F5F5
          </p>
        </Header>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2>Typography</h2>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <p>
            Body text uses <strong>#F5F5F5</strong>.{' '}
            <Link href="#">Links are #00E5FF</Link> and underline on hover.
          </p>
          <Text disabled>Disabled text (#555555).</Text>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2>Buttons</h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <Button variant="primary">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2>Form elements</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <Field label="Input" htmlFor="input-default">
              <Input id="input-default" placeholder="Placeholder" />
            </Field>
            <Field label="Focus state" htmlFor="input-focus">
              <Input id="input-focus" placeholder="Focus me" />
            </Field>
          </div>
          <Field
            label="Textarea"
            htmlFor="textarea-demo"
            style={{ maxWidth: 300 }}
          >
            <Textarea
              id="textarea-demo"
              placeholder="Multi-line…"
            />
          </Field>
          <Field label="Select" htmlFor="select-demo">
            <Select
              id="select-demo"
              options={['Option A', 'Option B', 'Option C']}
            />
          </Field>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <Checkbox label="Checkbox" defaultChecked />
            <Radio name="r" label="Radio 1" defaultChecked />
            <Radio name="r" label="Radio 2" />
          </div>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2>States</h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <Message variant="success">Success (#00FFAD)</Message>
            <Message variant="error">Error (#FF5252)</Message>
          </div>
          <Field
            hint="Input with success state"
            style={{ maxWidth: 300, marginBottom: '1rem' }}
          >
            <Input state="success" defaultValue="Valid value" readOnly />
          </Field>
          <Field
            hint="Input with error state"
            error
            style={{ maxWidth: 300 }}
          >
            <Input state="error" defaultValue="Invalid value" readOnly />
          </Field>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2>Dividers & borders</h2>
          <Divider />
          <Box
            style={{
              padding: '1rem',
              borderRadius: 'var(--border-radius-md)',
            }}
          >
            Bordered box (#2D2D2D)
          </Box>
        </section>
      </main>
    </div>
  )
}

export default App
