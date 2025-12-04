-- Alterar pergunta sobre trajetória artística de 'text' para 'textarea'
-- Para ter campo maior e melhor visualização ao escrever

UPDATE questions
SET field_type = 'textarea'
WHERE text ILIKE '%trajetória%artista%'
   OR text ILIKE '%trabalho que você desenvolve%'
   OR text ILIKE '%texto de apresentação%';

-- Verificar qual pergunta foi alterada
SELECT id, text, field_type 
FROM questions 
WHERE text ILIKE '%trajetória%'
   OR text ILIKE '%apresentação na rede social%'
ORDER BY "order";

