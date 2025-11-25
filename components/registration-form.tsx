"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RegistrationForm() {
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica de envio do formulário
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4 max-w-3xl mx-auto">
      {/* Aviso de Privacidade */}
      <Alert>
        <AlertDescription className="text-sm leading-relaxed">
          <strong>Privacidade e Proteção de Dados:</strong> Seus dados serão utilizados exclusivamente para o projeto Visibilidade em Foco e não serão compartilhados com terceiros sem seu consentimento. Você pode solicitar a remoção das suas informações a qualquer momento.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">Dados Pessoais</h3>
        
        <div className="space-y-2">
          <Label htmlFor="name">1. Nome Completo *</Label>
          <Input 
            id="name" 
            required 
            placeholder="Seu nome completo"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="artistName">2. Nome Artístico</Label>
          <Input 
            id="artistName" 
            placeholder="Como você é conhecido artisticamente"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">3. E-mail *</Label>
          <Input 
            id="email" 
            type="email" 
            required 
            placeholder="seu@email.com"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">4. Telefone/WhatsApp *</Label>
          <Input 
            id="phone" 
            type="tel" 
            required 
            placeholder="(11) 99999-9999"
            className="w-full"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">5. Idade *</Label>
            <Input 
              id="age" 
              type="number" 
              required 
              placeholder="Ex: 25"
              min="0"
              max="120"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">6. Cidade *</Label>
            <Input 
              id="city" 
              required 
              placeholder="São Roque"
              defaultValue="São Roque"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">7. Estado *</Label>
            <Select required defaultValue="SP">
              <SelectTrigger id="state">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pronoun">8. Pronomes *</Label>
          <Input 
            id="pronoun" 
            required 
            placeholder="Ex: ele/dele, ela/dela, elu/delu"
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">Identidade e Expressão</h3>
        
        <div className="space-y-2">
          <Label htmlFor="identity">9. Como você se identifica? *</Label>
          <Input 
            id="identity" 
            required 
            placeholder="Ex: gay, lésbica, bissexual, trans, não-binário..."
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>10. Você é uma pessoa trans? *</Label>
          <RadioGroup required>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="trans-sim" />
              <Label htmlFor="trans-sim" className="font-normal cursor-pointer">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="trans-nao" />
              <Label htmlFor="trans-nao" className="font-normal cursor-pointer">Não</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prefiro-nao-responder" id="trans-prefiro" />
              <Label htmlFor="trans-prefiro" className="font-normal cursor-pointer">Prefiro não responder</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="race">11. Raça/Etnia *</Label>
          <Select required>
            <SelectTrigger id="race">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="branca">Branca</SelectItem>
              <SelectItem value="preta">Preta</SelectItem>
              <SelectItem value="parda">Parda</SelectItem>
              <SelectItem value="indigena">Indígena</SelectItem>
              <SelectItem value="amarela">Amarela</SelectItem>
              <SelectItem value="prefiro-nao-responder">Prefiro não responder</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">Trajetória Artística</h3>

        <div className="space-y-2">
          <Label htmlFor="area">12. Área Artística Principal *</Label>
          <Select required>
            <SelectTrigger id="area">
              <SelectValue placeholder="Selecione sua área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="musica">Música</SelectItem>
              <SelectItem value="teatro">Teatro</SelectItem>
              <SelectItem value="danca">Dança</SelectItem>
              <SelectItem value="artes-visuais">Artes Visuais</SelectItem>
              <SelectItem value="literatura">Literatura</SelectItem>
              <SelectItem value="audiovisual">Audiovisual</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="drag">Drag</SelectItem>
              <SelectItem value="moda">Moda</SelectItem>
              <SelectItem value="artesanato">Artesanato</SelectItem>
              <SelectItem value="outra">Outra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="other-areas">13. Outras áreas que você atua</Label>
          <Input 
            id="other-areas" 
            placeholder="Ex: fotografia, design, curadoria..."
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">14. Há quanto tempo você atua como artista? *</Label>
          <Select required>
            <SelectTrigger id="time">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="menos-1">Menos de 1 ano</SelectItem>
              <SelectItem value="1-3">1 a 3 anos</SelectItem>
              <SelectItem value="3-5">3 a 5 anos</SelectItem>
              <SelectItem value="5-10">5 a 10 anos</SelectItem>
              <SelectItem value="mais-10">Mais de 10 anos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">15. Conte sobre sua trajetória artística *</Label>
          <Textarea 
            id="bio" 
            required 
            placeholder="Descreva sua trajetória, obras, projetos e o que te inspira..."
            className="min-h-32 resize-y"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="works">16. Principais trabalhos ou projetos</Label>
          <Textarea 
            id="works" 
            placeholder="Liste seus principais trabalhos, exposições, apresentações, publicações..."
            className="min-h-24 resize-y"
          />
        </div>

        <div className="space-y-2">
          <Label>17. Você vive da sua arte? *</Label>
          <RadioGroup required>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim-exclusivamente" id="vive-sim" />
              <Label htmlFor="vive-sim" className="font-normal cursor-pointer">Sim, exclusivamente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="parcialmente" id="vive-parcial" />
              <Label htmlFor="vive-parcial" className="font-normal cursor-pointer">Parcialmente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="vive-nao" />
              <Label htmlFor="vive-nao" className="font-normal cursor-pointer">Não</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">Conexões e Visibilidade</h3>

        <div className="space-y-2">
          <Label htmlFor="links">18. Links de Redes Sociais e Portfolio</Label>
          <Textarea 
            id="links" 
            placeholder="Instagram: @seuuser&#10;Site: www.seusite.com&#10;YouTube: link&#10;Spotify: link"
            className="min-h-24 resize-y"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="challenges">19. Quais são os principais desafios que você enfrenta como artista LGBTS?</Label>
          <Textarea 
            id="challenges" 
            placeholder="Compartilhe os desafios que você enfrenta no cenário artístico..."
            className="min-h-24 resize-y"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectations">20. O que você espera deste mapeamento?</Label>
          <Textarea 
            id="expectations" 
            placeholder="Quais são suas expectativas em relação ao projeto Visibilidade em Foco?"
            className="min-h-24 resize-y"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">Foto de Perfil</h3>
        
        <div className="space-y-2">
          <Label htmlFor="photo">Envie uma foto sua</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
              type="file"
              id="photo"
              accept="image/*"
              className="hidden"
            />
            <label htmlFor="photo" className="cursor-pointer flex flex-col items-center gap-3">
              <Upload className="w-10 h-10 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Clique para escolher uma imagem
              </span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG até 5MB
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Consentimento */}
      <div className="flex items-start gap-3 py-4 bg-muted/30 p-6 rounded-lg">
        <Checkbox 
          id="consent" 
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked as boolean)}
          required
        />
        <label
          htmlFor="consent"
          className="text-sm leading-relaxed cursor-pointer"
        >
          Eu concordo com o uso das minhas informações para o projeto Visibilidade em Foco e estou ciente dos meus direitos de privacidade conforme a LGPD. *
        </label>
      </div>

      {/* Submit */}
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
        disabled={!agreed}
      >
        Enviar Cadastro
      </Button>

      {submitted && (
        <Alert className="bg-primary/10 border-primary">
          <AlertDescription className="text-center font-medium">
            ✓ Cadastro enviado com sucesso! Em breve entraremos em contato.
          </AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-center text-muted-foreground">
        * Campos obrigatórios
      </p>
    </form>
  )
}
