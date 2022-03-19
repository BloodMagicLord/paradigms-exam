(defn proto-get
    "Returns object property respecting the prototype chain"
    ([obj key] (proto-get obj key nil))
    ([obj key default]
        (cond
            (contains? obj key) (obj key)
            (contains? obj :prototype) (proto-get (obj :prototype) key default)
            :else default)))

(defn proto-call
    "Calls object method respecting the prototype chain"
    [this key & args]
       (apply (proto-get this key) this args))
	   
(defn get-value [key]
  (fn [this] (proto-get this key)))
  
(defn get-method [key]
  (fn [this & args] (apply proto-call this key args)))
  
(def toBBCode (get-method  :toBBCode))
(def toHTML (get-method  :toHTML))  
(def toString (get-method  :toString))  
;;=====================================================================================
(def ContentPrototype
  (let [content (get-value  :content)]
    {
		:toString (fn [this] (let [content (content this)] (str content)))
		:toBBCode toString
		:toHTML toString
    }))
	
(defn Content [content]
  {
   :prototype ContentPrototype
   :content content})
;;=====================================================================================
(def Node
	(let [content (get-value   :content)
		  leftBoarderBBCode (get-value  :leftBoarderBBCode)
		  rightBoarderBBCode (get-value  :rightBoarderBBCode)
		  leftBoarderHTML (get-value   :leftBoarderHTML)
		  rightBoarderHTML (get-value  :rightBoarderHTML)]
		{
			:toBBCode(fn [this] (let [content (content this) 
										leftBoarder (str "[" (leftBoarderBBCode this) "]")
										rightBoarder (str "[" (rightBoarderBBCode this) "]")]
								(str leftBoarder (toBBCode content) rightBoarder)))
			
			:toHTML(fn [this] (let [content (content this) 
										leftBoarder (str "<" (leftBoarderHTML this) ">")
										rightBoarder (str "<" (rightBoarderHTML this) ">")]
								(str leftBoarder (toHTML content) rightBoarder)))
		}
	)
)
;;=====================================================================================
(defn Bolded [content]
  {:prototype Node
   :content content
   :leftBoarderBBCode "b"
   :rightBoarderBBCode "/b"
   :leftBoarderHTML "strong"
   :rightBoarderHTML "/strong"
  })
  
(defn Italicized [content]
  {:prototype Node
   :content content
   :leftBoarderBBCode "i"
   :rightBoarderBBCode "/i"
   :leftBoarderHTML "em"
   :rightBoarderHTML "/em"
  })
  
(defn Strikethrough [content]
  {:prototype Node
   :content content
   :leftBoarderBBCode "s"
   :rightBoarderBBCode "/s"
   :leftBoarderHTML "del"
   :rightBoarderHTML "/del"
  })
  
(defn Underlined  [content]
  {:prototype Node
   :content content
   :leftBoarderBBCode "u"
   :rightBoarderBBCode "/u"
   :leftBoarderHTML "ins"
   :rightBoarderHTML "/ins"
  })
  
(defn html [Code] (toHTML Code))  
;;=====================================================================================
(def Example (Bolded (Italicized (Strikethrough (Underlined (Content "Text Example"))))))

(println (toBBCode Example))
(println (html Example))
      
