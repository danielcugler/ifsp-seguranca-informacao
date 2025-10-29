"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2, XCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const CIFRAR_EXAMPLES = [
  {
    id: "cifrar-example1",
    label: "Example 1",
    payload: {
      textoClaro: "Teste Cifra de Vernan - IFSP",
      chave: "12345EOOawdfeXVVMaaaqwappyuz",
    },
  },
  {
    id: "cifrar-example2",
    label: "Example 2",
    payload: {
      textoClaro: "Turma de ADS - Prontos para o mercado",
      chave: "12345EOOawdfeXVVMaaaqwappyuzq34xFA2WW",
    },
  },
  {
    id: "cifrar-example3",
    label: "Example 3",
    payload: {
      textoClaro: "UmTextoSemExpaco",
      chave: "QexYxwrfPOWMaQWKLss",
    },
  },
]

const DECIFRAR_EXAMPLES = [
  {
    id: "decifrar-example1",
    label: "Example 1",
    payload: {
      textoCifrado:
        "01100101010101110100000001000000010100000110010100001100001001100000011100000101000001010100011000000001001111010111011000000000001010000001001100001111000000000001111101010111010011000101000000111001001111110010011000101010",
      chave: "12345EOOawdfeXVVMaaaqwappyuz",
    },
  },
  {
    id: "decifrar-example2",
    label: "Example 2",
    payload: {
      textoCifrado:
        "01100101010001110100000101011001010101000110010100101011001010100100000100110110001000000011010101000101011101010111011000000110001111110000111000001111000101010001111000000100010000010000000000010001000010110001010001011010000111100001001101011001000111010011010000100010010100110011001100111000",
      chave: "12345EOOawdfeXVVMaaaqwappyuzq34xFA2WW",
    },
  },
  {
    id: "decifrar-example3",
    label: "Example 3",
    payload: {
      textoCifrado:
        "00000100000010000010110000111100000000000000001100011101001101010011010100100010000100100011010100010001001100000011010000100100",
      chave: "QexYxwrfPOWMaQWKLss",
    },
  },
]

const EXPECTED_RESPONSES = {
  "cifrar-example1": {
    textoCifrado:
      "01100101010101110100000001000000010100000110010100001100001001100000011100000101000001010100011000000001001111010111011000000000001010000001001100001111000000000001111101010111010011000101000000111001001111110010011000101010",
  },
  "cifrar-example2": {
    textoCifrado:
      "01100101010001110100000101011001010101000110010100101011001010100100000100110110001000000011010101000101011101010111011000000110001111110000111000001111000101010001111000000100010000010000000000010001000010110001010001011010000111100001001101011001000111010011010000100010010100110011001100111000",
  },
  "cifrar-example3": {
    textoCifrado:
      "00000100000010000010110000111100000000000000001100011101001101010011010100100010000100100011010100010001001100000011010000100100",
  },
  "decifrar-example1": {
    textoClaro: "Teste Cifra de Vernan - IFSP",
  },
  "decifrar-example2": {
    textoClaro: "Turma de ADS - Prontos para o mercado",
  },
  "decifrar-example3": {
    textoClaro: "UmTextoSemExpaco",
  },
}

export default function Home() {
  const [endpoint, setEndpoint] = useState("")
  const [payload, setPayload] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedExample, setSelectedExample] = useState<string>("")

  const isValidEndpoint = endpoint.endsWith("cifrar") || endpoint.endsWith("decifrar")

  const isValidExampleResponse = () => {
    if (!selectedExample || !response) {
      return null
    }

    const expected = EXPECTED_RESPONSES[selectedExample as keyof typeof EXPECTED_RESPONSES]
    if (!expected) {
      return null
    }

    if ("textoCifrado" in expected) {
      return response.textoCifrado === expected.textoCifrado
    } else if ("textoClaro" in expected) {
      return response.textoClaro === expected.textoClaro
    }

    return null
  }

  const handleExampleChange = (exampleId: string) => {
    setSelectedExample(exampleId)
    const example = [...CIFRAR_EXAMPLES, ...DECIFRAR_EXAMPLES].find((ex) => ex.id === exampleId)
    if (example) {
      setPayload(JSON.stringify(example.payload, null, 2))
    }
  }

  const makeRequest = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      if (!endpoint.trim()) {
        throw new Error("Please provide an API endpoint")
      }

      let parsedPayload
      try {
        parsedPayload = JSON.parse(payload)
      } catch (e) {
        throw new Error("Invalid JSON payload. Please check your JSON syntax.")
      }

      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: endpoint,
          payload: parsedPayload,
        }),
      })

      if (!res.ok) {
        let errorDetails = ""
        try {
          const errorData = await res.json()
          errorDetails = errorData.message || errorData.error || JSON.stringify(errorData)
        } catch {
          try {
            errorDetails = await res.text()
          } catch {
            errorDetails = "No additional error details available"
          }
        }

        throw new Error(`HTTP ${res.status} ${res.statusText}\nEndpoint: ${endpoint}\nDetails: ${errorDetails}`)
      }

      const data = await res.json()
      setResponse(data)
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          `Network Error: Failed to connect to ${endpoint}\n\n` +
            `Possible causes:\n` +
            `• The server is not running or unreachable\n` +
            `• CORS policy is blocking the request\n` +
            `• Invalid URL format\n` +
            `• Network connectivity issues`,
        )
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Vernam's Cipher API Test Tool</h1>
          <p className="text-muted-foreground">
            This application was created by Vercel's V0 AI tool! It is cool, isn't it?
          </p>
        </div>

        <Card>
          <CardHeader></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                type="url"
                placeholder="https://api.example.com/endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left column - Cifrar Payload Examples */}
              <div className="space-y-3">
                <Label>Cifrar Payload Examples</Label>
                <RadioGroup value={selectedExample} onValueChange={handleExampleChange}>
                  {CIFRAR_EXAMPLES.map((example) => (
                    <div key={example.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={example.id} id={example.id} />
                      <Label htmlFor={example.id} className="cursor-pointer font-normal">
                        {example.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Right column - Decifrar Payload Examples */}
              <div className="space-y-3">
                <Label>Decifrar Payload Examples</Label>
                <RadioGroup value={selectedExample} onValueChange={handleExampleChange}>
                  {DECIFRAR_EXAMPLES.map((example) => (
                    <div key={example.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={example.id} id={example.id} />
                      <Label htmlFor={example.id} className="cursor-pointer font-normal">
                        {example.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payload">JSON Payload</Label>
              <Textarea
                id="payload"
                placeholder='{"key": "value"}'
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="font-mono text-sm min-h-[200px]"
              />
            </div>

            <Button onClick={makeRequest} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Spinner className="mr-2" />
                  Sending Request...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-destructive whitespace-pre-wrap font-sans text-sm">{error}</pre>
            </CardContent>
          </Card>
        )}

        {response && (
          <Card>
            <CardHeader>
              <CardTitle>API Response</CardTitle>
              <CardDescription>The server returned the following data</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{JSON.stringify(response, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Validations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              {isValidEndpoint ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">The endpoint contains 'cifrar' or 'decifrar'</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isValidEndpoint
                    ? "Endpoint is valid and ends with 'cifrar' or 'decifrar'"
                    : "Endpoint does not end with 'cifrar' or 'decifrar'"}
                </p>
              </div>
            </div>

            {selectedExample && (
              <div className="flex items-start gap-3 pt-4 border-t">
                {isValidExampleResponse() === null ? (
                  <div className="h-5 w-5 mt-0.5 flex-shrink-0" />
                ) : isValidExampleResponse() ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="w-full">
                  <p className="font-medium">Response Validation for {selectedExample.replace("-", " ")}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {!response
                      ? "No response yet. Send a request to validate."
                      : isValidExampleResponse()
                        ? "Response matches the expected value"
                        : "Response does not match the expected value"}
                  </p>
                  {response && !isValidExampleResponse() && (
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-2">Expected response:</p>
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(
                          EXPECTED_RESPONSES[selectedExample as keyof typeof EXPECTED_RESPONSES],
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
