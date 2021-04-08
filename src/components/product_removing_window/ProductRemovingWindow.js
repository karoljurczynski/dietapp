export default function ProductRemovingWindow(props) {
  
  return (
    <div className="meal__removing-window">
        <form onSubmit={ props.handleProductRemoving }>

          { props.productList.map(product => {
            return (

              <span key={ product.id }>
                <label htmlFor={ product.name }>{ product.name }</label>
                <input type="checkbox" id={ product.id } name={ product.name } />
              </span>

            )
          })}

          <input type="submit" value="Remove"/>
        </form>

        <button onClick={ props.handleRemovingWindow }>Cancel</button>
      </div>
  )
}