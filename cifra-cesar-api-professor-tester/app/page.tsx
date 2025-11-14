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
      textoClaro: "teste cifra de cesar",
      deslocamento: 13,
    },
  },
  {
    id: "cifrar-example2",
    label: "Example 2",
    payload: {
      textoClaro: "turma de ads prontos para o mercado",
      deslocamento: 2,
    },
  },
  {
    id: "cifrar-example3",
    label: "Example 3",
    payload: {
      textoClaro: "quem nunca errou que aperte a primeira tecla",
      deslocamento: 18,
    },
  },
]

const DECIFRAR_EXAMPLES = [
  {
    id: "decifrar-example1",
    label: "Example 1",
    payload: {
      textoCifrado:
        "bt kvpz aylz xbhayv",
      deslocamento: 7,
    },
  },
  {
    id: "decifrar-example2",
    label: "Example 2",
    payload: {
      textoCifrado:
        "fymo fks dsbkb noj",
      deslocamento: 10,
    },
  },
  {
    id: "decifrar-example3",
    label: "Example 3",
    payload: {
      textoCifrado:
        "etmw jsveq yqe vizspyges re gsqtyxeges",
      deslocamento: 4,
    },
  },
]

const DECIFRARFORCABRUTA_EXAMPLES = [
  {
    id: "decifrarforcabruta-example1",
    label: "Example 1",
    payload: {
      textoCifrado:
        "axm ygzpa", //ola mundo (deslocamento 12) 
    },
  },
  {
    id: "decifrarforcabruta-example2",
    label: "Example 2",
    payload: {
      textoCifrado:
        "pmzw l bth lejlslual puzapabpjhv kl luzpuv", //ifsp e uma excelente instituicao de ensino (deslocamento 7)
    },
  },
  {
    id: "decifrarforcabruta-example3",
    label: "Example 3",
    payload: {
      textoCifrado:
        "rdq nt mzn rdq dhr z ptdrszn", // ser ou nao ser eis a questao (deslocamento 25)
    },
  },
]

const EXPECTED_RESPONSES = {
  "cifrar-example1": {
    textoCifrado:
      "grfgr pvsen qr prfne",
  },
  "cifrar-example2": {
    textoCifrado:
      "vwtoc fg cfu rtqpvqu rctc q ogtecfq",
  },
  "cifrar-example3": {
    textoCifrado:
      "imwe fmfus wjjgm imw shwjlw s hjaewajs lwuds",
  },


  "decifrar-example1": {
    textoClaro: "um dois tres quatro",
  },
  "decifrar-example2": {
    textoClaro: "voce vai tirar dez",
  },
  "decifrar-example3": {
    textoClaro: "apis foram uma revolucao na computacao",
  },


  "decifrarforcabruta-example1": {
    textoClaro: "ola mundo",
  },
  "decifrarforcabruta-example2": {
    textoClaro: "ifsp e uma excelente instituicao de ensino",
  },
  "decifrarforcabruta-example3": {
    textoClaro: "ser ou nao ser eis a questao",
  },  
}

export default function Home() {
  const [endpoint, setEndpoint] = useState("http://localhost:3000/cifrar")
  const [payload, setPayload] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedExample, setSelectedExample] = useState<string>("")

  const isValidEndpoint = endpoint.toLowerCase().endsWith("cifrar") || endpoint.toLowerCase().endsWith("decifrar") || endpoint.toLowerCase().endsWith("decifrarforcabruta") 

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
    const example = [...CIFRAR_EXAMPLES, ...DECIFRAR_EXAMPLES, ...DECIFRARFORCABRUTA_EXAMPLES].find((ex) => ex.id === exampleId)
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

      const cleanedEndpoint = endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint; //removing the trail slash if the endpoint URL has it

      const isRadioBoxSelectedForSomeCifrarExample = CIFRAR_EXAMPLES.some(example => example.id === selectedExample); //checking if the radiobox selected is one of the CIFRAR_EXAMPLES. Only those will expect the endpoint to finish with 'cifrar'
      if(isRadioBoxSelectedForSomeCifrarExample && !cleanedEndpoint.endsWith("/cifrar")) {
        alert("Endpoint does not finish with '/cifrar', is that correct?");
      }

      const isRadioBoxSelectedForSomeDecifrarExample = DECIFRAR_EXAMPLES.some(example => example.id === selectedExample); //checking if the radiobox selected is one of the DECIFRAR_EXAMPLES. Only those will expect the endpoint to finish with 'decifrar'
      if(isRadioBoxSelectedForSomeDecifrarExample && !cleanedEndpoint.endsWith("/decifrar")) {
        alert("Endpoint does not finish with '/decifrar', is that correct?");
      }

      const isRadioBoxSelectedForSomeDecifrarForcaBrutaExample = DECIFRARFORCABRUTA_EXAMPLES.some(example => example.id === selectedExample); //checking if the radiobox selected is one of the DECIFRARFORCABRUTA_EXAMPLES. Only those will expect the endpoint to finish with 'decifrarForcaBruta'
      if(isRadioBoxSelectedForSomeDecifrarForcaBrutaExample && !cleanedEndpoint.endsWith("/decifrarForcaBruta")) {
        alert("Endpoint does not finish with '/decifrarForcaBruta', is that correct?");
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
          <h1 className="text-4xl font-bold tracking-tight">Caesar's Cipher API Test Tool</h1>
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

            <div className="grid grid-cols-3 gap-6">
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

              {/* Middle column - Decifrar Payload Examples */}
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

              {/* Right column - Decifrar Forca Bruta Payload Examples */}
              <div className="space-y-3">
                <Label>Decifrar Forca Bruta Payload Examples</Label>
                <RadioGroup value={selectedExample} onValueChange={handleExampleChange}>
                  {DECIFRARFORCABRUTA_EXAMPLES.map((example) => (
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
                <p className="font-medium">The endpoint contains 'cifrar' or 'decifrar' or 'decifrarforcabruta'</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isValidEndpoint
                    ? "Endpoint is valid and ends with 'cifrar' or 'decifrar' or 'decifrarforcabruta'"
                    : "Endpoint does not end with 'cifrar' or 'decifrar' or 'decifrarforcabruta'"}
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
